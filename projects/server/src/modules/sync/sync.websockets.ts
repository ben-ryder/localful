import { WebSocketServer } from "ws";
import {Server} from "node:http";
import {ConfigService} from "@services/config/config.service.js";
import {EventsService} from "@services/events/events.service.js";

export interface SyncWebsocketControllerConfig {
    server: Server;
    path: string;
}

export class SyncWebsocketController {
    wss: WebSocketServer

    constructor(
        private configService: ConfigService,
        private eventService: EventsService
    ) {}

    async init(config: SyncWebsocketControllerConfig) {
        this.wss = new WebSocketServer({ noServer: true, clientTracking: false });

        config.server.on("upgrade", (req, socket, head) => {
            // Validate that the request is to the correct path and that a valid origin is set.
            if (
                req.url !== config.path ||
                !req.headers.origin ||
                !this.configService.config.app.allowedOrigins.includes(req.headers.origin)
            ) {
                socket.destroy();
                return
            }

            const websocketProtocol = req.headers["sec-websocket-protocol"]
            if (typeof websocketProtocol !== "string" || !websocketProtocol.startsWith("localful.ticket.")) {
                socket.destroy()
                return;
            }
            const connectionTicket = websocketProtocol.replace("localful.ticket.", "");

            // todo: validate some initial ticket or other authentication data before opening connection?
            console.debug(`connection with ${connectionTicket}`)

            this.wss.handleUpgrade(req, socket, head, (ws) => {
                this.wss.emit("connection", ws, req)
            })
        })

        this.wss.on("connection", (ws) => {
            ws.on("error", console.error);

            ws.on("message", function message(data) {
                const event = JSON.parse(data);

                switch (event.type) {
                    case "authenticate": {
                        console.debug("[SyncWebsocketController] authenticate: %s", data);
                        ws.send(JSON.stringify({type: "authenticate-ack"}));
                        break;
                    }
                    case "subscribe": {
                        console.debug("[SyncWebsocketController] subscribe: %s", data);
                        ws.send(JSON.stringify({type: "subscribe-ack"}));
                        break;
                    }
                    // If an unrecognised event is registered, just disconnect the client.
                    default: {
                        ws.close();
                    }
                }

            });
        })
    }
}
