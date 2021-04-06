import { Core } from "../core/Core";
import { ClientTransportLayer } from "../client-transport-layer/ClientTransportLayer";
import { ClientMessage } from "./ClientMessage";
import { AnyGame, PhaseClass } from "../core/Phase";
import { ServerMessage } from "../server/ServerMessage";
import { ClientAuthenticationProvider } from "../client-authentication-provider/ClientAuthenticationProvider";
import { ClientURLAuthenticationProvider } from "../client-authentication-provider/ClientURLAuthenticationProvider";
import * as winston from "winston";
import BrowserConsole from 'winston-transport-browserconsole';

// Necessary for winston to work in the browser: https://github.com/winstonjs/winston/issues/1354#issuecomment-426433071
import "setImmediate";
import _ from "lodash";

export interface ClientConfig<Game extends AnyGame> {
    gameClass: PhaseClass<Game>,
    transportLayer: ClientTransportLayer,
    authenticationProvider?: ClientAuthenticationProvider,
}

/**
 * Represents a client communicating with a {@link Server}
 */
export class Client<Game extends AnyGame> {
    core: Core<Game>;
    private config: ClientConfig<Game>;
    private transportLayer: ClientTransportLayer;
    private authenticationProvider: ClientAuthenticationProvider;
    logger: winston.Logger;

    userId: string;
    state: ClientState = ClientState.DISCONNECTED;

    onStateChange: () => void;

    get game(): Game {
        return this.core.game;
    }

    public constructor(config: ClientConfig<Game>) {
        this.config = config;

        this.transportLayer = config.transportLayer;
        this.transportLayer.onConnected = () => this.onConnected();
        this.transportLayer.onDisconnected = () => this.onDisconnected();
        this.transportLayer.onMessage = message => this.onMessage(message);

        this.authenticationProvider = config.authenticationProvider
            ? config.authenticationProvider
            : new ClientURLAuthenticationProvider();
        
        // Initialize logger
        this.logger = winston.createLogger({
            transports: [
                new BrowserConsole({
                    format: winston.format.simple(),
                    level: "debug"
                })
            ]
        });
    }

    public onMessage(messageObject: object): void {
        const message = messageObject as ServerMessage<Game>;

        this.logger.info("message received", {message});

        if (message.type == "sync") {
            const serializedCore = message.serializedCore;

            this.logger.info("sync message received");

            // Initialize a logger for core
            const logger = this.logger;

            this.core = Core.deserializeCore(this.config.gameClass, logger, _.cloneDeep(serializedCore))
            this.core.onStateChange = () => this.onStateChange ? this.onStateChange() : null;

            this.state = ClientState.SYNCED;
            
            if (this.onStateChange) {
                this.onStateChange();
            }
        } else if (message.type == "apply-action") {
            const {userId, action} = message;

            this.core.applyAction(userId, action);
        } else if (message.type == "user-connection") {
            this.core.fireUserConnectionEvent(message.userId);
        } else if (message.type == "user-disconnection") {
            this.core.fireUserDisconnectionEvent(message.userId);
        }
    }

    private sendMessage(message: ClientMessage): void {
        this.logger.debug("sending message", {message});

        this.transportLayer.transportMessage(message);
    }

    /**
     * Send an action to perform to the server.
     * @param action The action to apply to the game
     */
    public sendAction(action: object): void {
        this.sendMessage({
            type: "send-action",
            action
        });
    }

    public onConnected(): void {
        this.logger.info("Client connected");

        this.state = ClientState.WAITING_FOR_SYNC;
        if (this.onStateChange) {
            this.onStateChange();
        }

        const authenticationData = this.authenticationProvider.getAuthenticationData();

        this.userId = authenticationData.userId;

        // Once connected, send the authentication packet
        this.sendMessage({
            type: "authenticate",
            authenticationData
        });
    }

    public start(): void {
        this.logger.info("starting client");

        this.state = ClientState.CONNECTING;

        this.transportLayer.start();
        this.authenticationProvider.start();

        if (this.onStateChange) {
            this.onStateChange();
        }
    }

    public stop(): void {
        this.transportLayer.close();
    }

    public onDisconnected(): void {
        this.state = ClientState.DISCONNECTED;

        if (this.onStateChange) {
            this.onStateChange();
        }
    }
}

export enum ClientState {
    DISCONNECTED,
    CONNECTING,
    WAITING_FOR_SYNC,
    SYNCED,
}