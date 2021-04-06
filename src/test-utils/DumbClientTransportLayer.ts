import { ClientTransportLayer } from "../client-transport-layer/ClientTransportLayer";

export class DumbClientTransportLayer extends ClientTransportLayer {
    onMessageToTransport: (message: object) => void;
    onClose: () => void;

    start(): void {
        this.onConnected();
    }

    close(): void {
        this.onDisconnected();
        this.onClose();
    }

    transportMessage(message: object): void {
        this.onMessageToTransport(message);
    }

    notifyMessageReceived(message: object): void {
        this.onMessage(message);
    }

}