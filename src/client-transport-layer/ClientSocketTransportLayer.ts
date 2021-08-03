import { ClientTransportLayer } from "./ClientTransportLayer";

export class ClientSocketTransportLayer extends ClientTransportLayer {
    websocket: WebSocket;
    address: string;

    pingInterval: any;

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

    close(): void {
        this.websocket.close();
    }

    onOpen(): void {
        /**
         * Because some PaaS closes the websocket after inactivity (Heroku, for example),
         * send an empty message periodically to keep it alive. 
         */
        this.pingInterval = setInterval(() => {
            this.websocket.send("");
        }, 10000);

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