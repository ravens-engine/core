import { ServerTransportLayer } from "../server-transport-layer/ServerTransportLayer";

export class DumbServerTransportLayer extends ServerTransportLayer {
    onMessageToTransport: (clientId: string, message: any) => void;

    start(): void { }

    transportMessage(clientIds: string[], message: object): void {
        clientIds.forEach(clientId => this.onMessageToTransport(clientId, message));
    }

    notifyMessageReceived(clientId: string, message: object): void {
        this.onClientMessage(clientId, message);
    }

    notifyClose(clientId: string): void {
        this.onClientClose(clientId);
    }

}