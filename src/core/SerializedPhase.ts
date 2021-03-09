import { AnyPhase } from "./Phase";

export interface SerializedPhase<Phase extends AnyPhase> {
    id: string;
    state: object;
    child?: SerializedPhase<Phase>;
}