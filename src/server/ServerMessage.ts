import { AnyGame } from "../core/Phase";
import { SerializedPhase } from "../core/SerializedPhase";

export type ServerMessage<Game extends AnyGame> = ApplyAction<Game> | Sync<Game>;

interface ApplyAction<Game extends AnyGame> {
    type: "apply-action",
    playerId: string,
    action: object
}

interface Sync<Game extends AnyGame> {
    type: "sync",
    serializedRootPhase: SerializedPhase<Game>
}
