import { ClientTransportLayer } from "./ClientTransportLayer";

/**
 * @internal
 */
export class ClientSocketTransportLayer extends ClientTransportLayer {
    websocket: WebSocket;
    address: string;

    public constructor(address: string) {
        super();
        this.address = address;
    }

    start(): void {
        this.websocket = new WebSocket(this.address);

        this.websocket.onopen = () => this.onOpen();
        this.websocket.onclose = () => this.onClose();
        this.websocket.onmessage = (data: MessageEvent) => this.privateOnMessage(data);
    }

    onOpen(): void {
        this.onConnected();
    }

    onClose(): void {
        this.onDisconnected();
    }

    private privateOnMessage(data: MessageEvent): void {
        const message = JSON.parse(data.data as string);

        this.onMessage(message);
    }

    transportMessage(message: object): void {
        const messageRaw = JSON.stringify(message);

        this.websocket.send(messageRaw);
    }
}