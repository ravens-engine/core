import * as WebSocket from "ws";
import * as uuid from "uuid";
import { ServerTransportLayer } from "./ServerTransportLayer";
import express from "express";
import expressWs from "express-ws";

export class ServerSocketTransportLayer extends ServerTransportLayer {
    expressApp: any;
    websocketServer: WebSocket.Server;
    port: number;

    websockets: Map<string, WebSocket> = new Map();
    clientIds: Map<WebSocket, string> = new Map();

    public constructor(port = 8081) {
        super();
        this.port = process.env.PORT ? parseInt(process.env.PORT) : port;
    }

    start(): void {
        this.expressApp = express();
        expressWs(this.expressApp);

        this.expressApp.use(express.static("dist"));

        // @ts-ignore The "ws" method is added by "express-ws", but
        // is not referenced in "express" type files
        this.expressApp.ws("/", (websocket: WebSocket) => {
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

        this.expressApp.listen(this.port);
    }

    private privateOnMessage(websocket: WebSocket, messageRaw: string): void {
        // The client periodically sends an empty message as a keep-alive.
        // Ignore it
        if (messageRaw == "") {
            return;
        }

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