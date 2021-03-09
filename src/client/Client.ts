import { Core } from "../core/Core";
import { ClientTransportLayer } from "../client-transport-layer/ClientTransportLayer";
import { ClientMessage } from "./ClientMessage";
import { AnyGame, PhaseClass } from "../core/Phase";
import { ServerMessage } from "../server/ServerMessage";

export interface ClientConfig<Game extends AnyGame> {
    rootPhaseClass: PhaseClass<Game>,
    transportLayer: ClientTransportLayer
}

/**
 * Represents a client communicating with a {@link Server}
 */
export class Client<Game extends AnyGame> {
    private core: Core<Game>;
    private config: ClientConfig<Game>;
    private transportLayer: ClientTransportLayer;

    /**
     * @readonly
     */
    playerId: string = "1";

    /**
     * @readonly
     */
    state: ClientState = ClientState.DISCONNECTED;

    /**
     * @internal
     */
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
    }

    public onMessage(messageObject: object): void {
        const message = messageObject as ServerMessage<Game>;

        console.log("Received:");
        console.log(message);

        if (message.type == "sync") {
            const serializedRootPhase = message.serializedRootPhase;

            this.core = new Core(this.config.rootPhaseClass, serializedRootPhase);
            this.core.onStateChange = () => this.onStateChange();

            this.state = ClientState.SYNCED;
            
            this.onStateChange();
        } else if (message.type == "apply-action") {
            const playerId = message.playerId;
            const action = message.action;

            this.core.applyAction(message.playerId, message.action);
        }
    }

    private sendMessage(message: ClientMessage<Game>): void {
        this.transportLayer.transportMessage(message);
    }

    /**
     * Send an action to perform to the server.
     * @param action The action to apply to the game
     */
    public sendAction(action: object): void {
        this.transportLayer.transportMessage({
            type: "send-action",
            action
        });
    }

    /**
     * @internal
     */
    public onConnected(): void {
        console.log("Connected!");

        this.state = ClientState.WAITING_FOR_SYNC;
        this.onStateChange();

        // Once connected, send the authentication packet
        this.transportLayer.transportMessage({
            type: "authenticate",
            gameId: "1",
            playerId: "1",
            token: "1"
        });
    }

    public start(): void {
        this.transportLayer.start();

        this.state = ClientState.CONNECTING;
        this.onStateChange();
    }

    public onDisconnected(): void {
        this.state = ClientState.DISCONNECTED;

        this.onStateChange();
    }
}

export enum ClientState {
    DISCONNECTED,
    CONNECTING,
    WAITING_FOR_SYNC,
    SYNCED,
}