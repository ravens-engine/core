import { SerializedCore } from "../core/Core";
import { OperationContext } from "../core/OperationContext";
import { AnyGame } from "../core/Phase";

export type ServerMessage<Game extends AnyGame> = ApplyAction<Game> | Sync<Game>
    | UserConnection | UserDisconnection;

interface ApplyAction<Game extends AnyGame> {
    type: "apply-action",
    userId: string,
    action: object,
    operationContext: OperationContext,
}

interface Sync<Game extends AnyGame> {
    type: "sync",
    serializedCore: SerializedCore<Game>
}

interface UserConnection {
    type: "user-connection",
    userId: string,
    operationContext: OperationContext,
}

interface UserDisconnection {
    type: "user-disconnection",
    userId: string,
    operationContext: OperationContext,
}
