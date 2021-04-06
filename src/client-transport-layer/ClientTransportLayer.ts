export abstract class ClientTransportLayer {
    onMessage: (message: object) => void;
    onConnected: () => void;
    onDisconnected: () => void;

    abstract start(): void;
    abstract close(): void;
    abstract transportMessage(message: object): void;
}