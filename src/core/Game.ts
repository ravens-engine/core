import { Phase, AnyPhase } from "./Phase";

export class Game<State = null, Action = null, Children extends (AnyPhase | null) = null> extends Phase<State, Action, null, null, Children> {
    static id: string = "root";
}