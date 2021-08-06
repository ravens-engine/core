import _ from "lodash";
import * as winston from "winston";
import { ClientMessage } from "../client/ClientMessage";
import { Core } from "../core/Core";
import { InvalidActionError } from "../core/errors/InvalidActionError";
import { OperationContext } from "../core/OperationContext";
import { AnyGame, PhaseClass } from "../core/Phase";
import { SerializedGame } from "../core/SerializedGame";
import { AirMeepleServerPersistenceLayer } from "../server-persistence-layer/AirMeepleServerPersistenceLayer";
import { DumbServerPersistenceLayer } from "../server-persistence-layer/DumbServerPersistenceLayer";
import { ServerPersistenceLayer } from "../server-persistence-layer/ServerPersistenceLayer";
import { ServerSocketTransportLayer } from "../server-transport-layer/ServerSocketTransportLayer";
import { ServerTransportLayer } from "../server-transport-layer/ServerTransportLayer";
import { ServerMessage } from "./ServerMessage";

export interface ServerConfig<Game extends AnyGame> {
    gameClass: PhaseClass<Game>,
    transportLayer: ServerTransportLayer,
    persistenceLayer?: ServerPersistenceLayer;
}

export class Server<Game extends AnyGame> {
    gameClass: PhaseClass<Game>;

    transportLayer: ServerTransportLayer;
    persistenceLayer: ServerPersistenceLayer;
    cores: Map<string, Core<Game>> = new Map();

    authContextForClientId: Map<string, {clientId: string, userId: string, matchId: string}> = new Map();
    // The key is of the form "{matchId}/{userId}"
    clientIdsForMatchIdAndUserId: Map<string, string[]> = new Map();
    userIdsForMatchId: Map<string, string[]> = new Map();

    logger: winston.Logger;

    public constructor(serverConfig: ServerConfig<Game>) {
        this.gameClass = serverConfig.gameClass;

        // Initialize transport layer
        if (serverConfig.transportLayer) {
            this.transportLayer = serverConfig.transportLayer;
        } else {
            // Setup the default one
            this.transportLayer = new ServerSocketTransportLayer();
        }
        this.transportLayer.onClientMessage = (clientId, messageObject) => this.onClientMessage(clientId, messageObject);
        this.transportLayer.onClientClose = (clientId) => this.onClientClose(clientId);

        // Initialize logger
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
            transports: [
                new winston.transports.Console(),
            ]
        });

        // Initialize persistence layer
        if (serverConfig.persistenceLayer) {
            this.persistenceLayer = serverConfig.persistenceLayer;
        } else {
            const persistenceType = process.env.PERSISTENCE_LAYER;
            if (persistenceType == "AIRMEEPLE") {
                const baseUrl = process.env.AIRMEEPLE_BASE_URL || "http://airmeeple.io/api";
                const username = process.env.AIRMEEPLE_USERNAME || "default";
                const password = process.env.AIRMEEPLE_PASSWORD || "default";
                const gameId = process.env.AIRMEEPLE_GAME_ID || "default";
                this.persistenceLayer = new AirMeepleServerPersistenceLayer(baseUrl, gameId, username, password);
            } else {
                this.persistenceLayer = new DumbServerPersistenceLayer();
            }
        }
        this.persistenceLayer.server = this;
    }

    start(): void {
        this.logger.info("starting server");

        this.transportLayer.start();
        this.persistenceLayer.start();
    }

    async getCoreForMatchId(matchId: string): Promise<Core<Game> | null> {
        // Check if the match has already been loaded (i.e. if a core has already
        // been created)
        if (!this.cores.has(matchId)) {
            // If not, fetch the data about the match from the persistence layer
            const persistedMatchData = await this.persistenceLayer.getMatch(matchId);

            if (persistedMatchData == null) {
                this.logger.info("couldn't find match", {matchId});

                return null;
            }

            // Setup a logger for this game
            const logger = this.logger.child({matchId});

            // Log whether this was a newly loaded game
            let core: Core<Game>;
            if (persistedMatchData.serializedMatch == null) {
                this.logger.info("loading a match from nothing", {matchId});

                core = new Core<Game>(
                    matchId,
                    persistedMatchData.name,
                    this.gameClass,
                    logger
                );
            } else {
                this.logger.info("loading a match with existing serialized data", {matchId});

                core = Core.deserializeCore<Game>(this.gameClass, logger, {
                    id: matchId,
                    name: persistedMatchData.name,
                    status: persistedMatchData.status,
                    serializedGame: persistedMatchData.serializedMatch as SerializedGame<Game>,
                    maxPlayers: persistedMatchData.maxPlayers,
                    players: persistedMatchData.players
                });
            }

            this.cores.set(matchId, core);

            return core;
        } else {
            return this.cores.get(matchId)!;
        }
    }

    async saveMatch(matchId: string, core: Core<Game>): Promise<void> {
        const serializedCore = core.serializeCore();

        this.persistenceLayer.saveMatch(
            serializedCore
        );
    }

    sendMessage(matchId: string, userId: string, message: ServerMessage<Game>): void {
        const clientIds = this.clientIdsForMatchIdAndUserId.get(userId)!;

        this.transportLayer.transportMessage(clientIds, message);
    }

    /**
     * Broadcasts a message to all the clients associated with a game
     */
    broadcastMessage(matchId: string, message: ServerMessage<Game>, excludedUserIds: string[] = []): void {
        const clientIds = _.without(this.userIdsForMatchId.get(matchId)!, ...excludedUserIds)
            .map(userId => this.clientIdsForMatchIdAndUserId.get(matchId + "/" + userId)!)
            //@ts-expect-error "flat" does exists
            .flat();
        this.transportLayer.transportMessage(clientIds, message);
    }

    async onClientMessage(clientId: string, messageObject: object): Promise<void> {
        const message = messageObject as ClientMessage;

        if (!this.authContextForClientId.has(clientId)) {
            if (message.type == "authenticate") {
                const {userId, matchId, authToken} = message.authenticationData;

                this.logger.info("client trying to authenticate ", {clientId, userId, matchId});

                const userData = await this.persistenceLayer.authenticateUser(userId, matchId, authToken);

                if (userData == null) {
                    // Couldnt' find a user for this idea
                    this.logger.info("couldn't authenticate user", {userId, matchId});
                    return;
                }

                const authContext = {
                    userId,
                    matchId,
                    clientId
                }

                this.logger.info("client authenticated", {clientId});

                // Check if the match is already loaded in the game server
                const core = await this.getCoreForMatchId(matchId);

                if (core == null) {
                    this.logger.info("couldn't load match", {matchId});
                    return;
                }

                // A user _just_ connected if they were
                // not connected before.
                // A user may not _just_ connect if he
                // was already connected, via an other browser
                // tab, for example.
                const justConnected = !this.isConnected(matchId, userId);

                this.authContextForClientId.set(clientId, authContext);

                if (!this.clientIdsForMatchIdAndUserId.has(matchId + "/" + userId)) {
                    this.clientIdsForMatchIdAndUserId.set(matchId + "/" + userId, []);
                }
                this.clientIdsForMatchIdAndUserId.get(matchId + "/" + userId)!.push(clientId);

                if (!this.userIdsForMatchId.has(matchId)) {
                    this.userIdsForMatchId.set(matchId, []);
                }
                this.userIdsForMatchId.get(matchId)!.push(userId);

                // If the user just connected,
                // fire the event.
                if (justConnected) {
                    this.logger.info("first connection, firing up connection event", {clientId});

                    const operationContext = this.applyOperationToCore(matchId, core, () => {
                        core.fireUserConnectionEvent(userId);
                    });

                    // Send a notification to all the other users
                    // that a new user arrived
                    this.broadcastMessage(
                        matchId,
                        {
                            type: "user-connection",
                            userId,
                            operationContext
                        },
                        [userId]
                    );
                }

                // Send a sync packet
                this.transportLayer.transportMessage([clientId], {
                    type: "sync",
                    serializedCore: core.serializeCore()
                });
            }
        } else {
            const {userId, matchId} = this.authContextForClientId.get(clientId)!;
            const core = this.cores.get(matchId)!;

            // Check if this user is associated with a game
            if (message.type == "send-action") {
                const {action} = message;

                this.logger.info("received action from user", {clientId, userId, matchId, action});

                let errorHappened = false;
                let operationContext: OperationContext | null = null;
    
                try {
                    operationContext = this.applyOperationToCore(matchId, core, () => {
                        core.applyAction(userId, action);
                    });
                } catch (error) {
                    // Handle the case of an InvalidActionError to
                    // print a pretty log message
                    if (error instanceof InvalidActionError) {
                        console.warn("Invalid action received");
                        errorHappened = true;
                    } else {
                        throw error;
                    }
                }

                if (!errorHappened) {
                    this.broadcastMessage(matchId, {
                        type: "apply-action",
                        userId: userId,
                        action,
                        // @ts-ignore operationContext is always != null if we went into this condition
                        operationContext,
                    });
                }
            }
        }
    }

    private applyOperationToCore(matchId: string, core: Core<Game>, operation: () => void): OperationContext {
        // Generate the seed that will be used for randomness during this operation
        const seed = Math.floor(Math.random() * 1000000);
        core.setSeed(seed);

        operation();

        this.saveMatch(matchId, core);

        return {
            seed
        };
    }

    private isConnected(matchId: string, userId: string): boolean {
        return this.clientIdsForMatchIdAndUserId.has(userId);
    }

    onClientClose(clientId: string): void {
        this.logger.info("onClientClose called with", {clientId});

        if (this.authContextForClientId.has(clientId)) {
            const {userId, matchId} = this.authContextForClientId.get(clientId)!;

            this.logger.info("clientId associated with user", {userId, matchId});

            this.authContextForClientId.delete(clientId);
            
            const clientIds = this.clientIdsForMatchIdAndUserId.get(matchId + "/" + userId)!;
            clientIds.splice(clientIds.indexOf(clientId), 1);

            if (clientIds.length > 0) {
                this.clientIdsForMatchIdAndUserId.set(userId, clientIds);
            } else {
                this.logger.info("user disconnected", {userId, matchId});

                // This was the last connected client id for this user,
                // i.e this user is effectively offline for this game.
                this.clientIdsForMatchIdAndUserId.delete(userId);

                const userIds = this.userIdsForMatchId.get(matchId)!;
                userIds.splice(userIds.indexOf(userId), 1);

                if (userIds.length > 0) {
                    this.userIdsForMatchId.set(matchId, userIds);
                } else {
                    this.userIdsForMatchId.delete(matchId);
                }

                // Fire the disconnection event
                const core = this.cores.get(matchId)!;

                const operationContext = this.applyOperationToCore(matchId, core, () => {
                    core.fireUserDisconnectionEvent(userId);
                })

                this.broadcastMessage(
                    matchId,
                    {
                        type: "user-disconnection",
                        userId,
                        operationContext
                    }
                );
            }
        }
    }
}