import { AnyGame } from "./Phase";
import { SerializedPhase } from "./SerializedPhase";

export type SerializedGame<Phase extends AnyGame> = Omit<SerializedPhase<Phase>, "id">
