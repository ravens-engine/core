import { AnyGame } from "../core/Phase";

export type ClientMessage<Game extends AnyGame> = SendAction<Game> | Authenticate;

interface SendAction<Game extends AnyGame> {
    type: "send-action",
    action: object,
}

interface Authenticate {
    type: "authenticate",
    playerId: string,
    gameId: string,
    token: string,
}
