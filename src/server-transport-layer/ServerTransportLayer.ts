export abstract class ServerTransportLayer {
    onClientMessage: (clientId: string, message: object) => void;
    onClientClose: (clientId: string) => void;

    abstract start(): void;
    abstract transportMessage(clientIds: string[], message: object): void;
}