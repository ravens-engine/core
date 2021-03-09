import { ClientMessage } from "../client/ClientMessage";
import { Core } from "../core/Core";
import { AnyGame, PhaseClass } from "../core/Phase";
import { ServerSocketTransportLayer } from "../server-transport-layer/ServerSocketTransportLayer";
import { ServerTransportLayer } from "../server-transport-layer/ServerTransportLayer";
import { ServerMessage } from "./ServerMessage";

interface ServerConfig<Game extends AnyGame> {
    gameClass: PhaseClass<Game>,
    transportLayer: ServerSocketTransportLayer
}

export class Server<Game extends AnyGame> {
    rootPhaseClass: PhaseClass<Game>;

    transportLayer: ServerTransportLayer;
    cores: Map<string, Core<Game>> = new Map();

    authContextForClientId: Map<string, {clientId: string, playerId: string, gameId: string}> = new Map();
    clientIdsForPlayerId: Map<string, string[]> = new Map();

    public constructor(serverConfig: ServerConfig<Game>) {
        this.rootPhaseClass = serverConfig.gameClass;
        this.transportLayer = serverConfig.transportLayer;
        this.transportLayer.onClientMessage = (clientId, messageObject) => this.onClientMessage(clientId, messageObject);
        this.transportLayer.onClientClose = (clientId) => this.onClientClose(clientId);
    }

    start(): void {
        this.cores.set("1", new Core(this.rootPhaseClass));

        this.transportLayer.start();
    }

    sendMessage(playerId: string, message: ServerMessage<Game>): void {
        const clientIds = this.clientIdsForPlayerId.get(playerId)!;

        clientIds.forEach(clientId => {
            this.transportLayer.transportMessage(clientId, message);
        });
    }

    broadcastMessage(message: ServerMessage<Game>): void {
        this.transportLayer.transportMessage(null, message);
    }

    onClientMessage(clientId: string, messageObject: object) {
        const message = messageObject as ClientMessage<Game>;

        if (!this.authContextForClientId.has(clientId)) {
            if (message.type == "authenticate") {
                const playerId = message.playerId;
                const gameId = message.gameId;
                const token = message.token;

                // TODO: Authentication
                if (true) {
                    const authContext = {
                        playerId,
                        gameId,
                        clientId
                    }

                    console.log(`Authenticated client ${clientId} as player ${playerId} for game ${gameId}`);

                    this.authContextForClientId.set(clientId, authContext);

                    if (!this.clientIdsForPlayerId.has(playerId)) {
                        this.clientIdsForPlayerId.set(playerId, []);
                    }
                    this.clientIdsForPlayerId.get(playerId)!.push(clientId);

                    // Add this player in the game, if necessary
                    const core = this.cores.get(gameId)!;

                    // Send an authentication packet
                    this.transportLayer.transportMessage(clientId, {
                        type: "sync",
                        serializedRootPhase: core.serializeRootPhase()
                    });
                }
            }
        } else {
            const authContext = this.authContextForClientId.get(clientId)!;
            const core = this.cores.get(authContext.gameId)!;

            // Check if this player is associated with a game
            if (message.type == "send-action") {
                const action = message.action;
    
                core.applyAction(authContext.playerId, action);

                this.broadcastMessage({
                    type: "apply-action",
                    playerId: authContext.playerId,
                    action
                });
            }
        }
    }

    onClientClose(clientId: string) {
        if (this.authContextForClientId.has(clientId)) {
            const authContext = this.authContextForClientId.get(clientId)!;

            this.authContextForClientId.delete(clientId);
            
            const clientIds = this.clientIdsForPlayerId.get(authContext.playerId)!;
            const newClientIds = clientIds.splice(clientIds.indexOf(clientId), 1);

            if (newClientIds.length > 0) {
                this.clientIdsForPlayerId.set(authContext.playerId, newClientIds);
            } else {
                // This was the last connected client id for this player,
                // i.e this player is effectively offline.
                this.clientIdsForPlayerId.delete(authContext.playerId);
            }
        }
    }
}