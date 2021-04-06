import * as WebSocket from "ws";
import * as uuid from "uuid";
import { ServerTransportLayer } from "./ServerTransportLayer";

export class ServerSocketTransportLayer extends ServerTransportLayer {
    websocketServer: WebSocket.Server;
    port: number;

    websockets: Map<string, WebSocket> = new Map();
    clientIds: Map<WebSocket, string> = new Map();

    public constructor(port = 8081) {
        super();
        this.port = port;
    }

    start(): void {
        this.websocketServer = new WebSocket.Server({
            port: this.port
        });

        this.websocketServer.on("connection", (websocket: WebSocket) => {
            // Generate an id to assign to this specific connection
            const clientId = uuid.v4();


            this.websockets.set(clientId, websocket);
            this.clientIds.set(websocket, clientId);

            websocket.on("message", (data: WebSocket.Data) => {
                this.privateOnMessage(websocket, data as string);
            });

            websocket.on("close", () => {
                this.privateOnClose(websocket);
            });
        });
    }

    private privateOnMessage(websocket: WebSocket, messageRaw: string): void {
        const message = JSON.parse(messageRaw);

        const clientId = this.clientIds.get(websocket)!;

        this.onClientMessage(clientId, message);
    }

    private privateOnClose(websocket: WebSocket): void {
        const clientId = this.clientIds.get(websocket)!;

        this.onClientClose(clientId);

        this.clientIds.delete(websocket);
        this.websockets.delete(clientId);
    }

    transportMessage(clientIds: string[], message: object): void {
        const messageRaw = JSON.stringify(message);

        clientIds.forEach(clientId => {
            const websocket = this.websockets.get(clientId)!;
            websocket.send(messageRaw);
        });
    }
}