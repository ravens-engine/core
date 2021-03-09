import _ from "lodash";
import { Phase, AnyPhase, PhaseClass, AnyGame } from "./Phase";
import { SerializedPhase } from "./SerializedPhase";

export class Core<Game extends AnyGame> {
    gameClass: PhaseClass<Game>;
    game: Game;

    onStateChange: () => void;

    constructor(gameClass: PhaseClass<Game>, serializedRootPhase: SerializedPhase<Game> | null = null) {
        this.gameClass = gameClass;

        if (serializedRootPhase == null) {
            this.game = new gameClass(null);
            this.game.initialize(null);
        } else {
            this.game = this.deserializePhase(null, this.gameClass, serializedRootPhase);

            // Once done, call onDeserialize on each phase
            this.callRecursivelyOnGame(phase => phase.onDeserialize());
        }
    }

    public serializeRootPhase(): SerializedPhase<Game> {
        return this.serializePhase(this.game);
    }

    applyAction(playerId: string, action: object): void {
        this.callRecursivelyOnGame(phase => phase.applyAction(playerId, action));

        if (this.onStateChange) {
            this.onStateChange();
        }
    }

    private callRecursivelyOnGame(callback: (phase: AnyPhase) => void) {
        this.callRecursivelyOnPhase(this.game, callback);
    }

    private callRecursivelyOnPhase(phase: AnyPhase, callback: (phase: AnyPhase) => void ) {
        callback(phase);

        // If the phase has a child, recursively apply the callback to the child as well
        if (phase.child != null) {
            this.callRecursivelyOnPhase(phase.child, callback);
        }
    }

    private serializePhase<Phase extends AnyPhase>(phase: Phase): SerializedPhase<Phase> {
        const id = (phase.constructor as typeof Phase).id;

        if (!id) {
            throw new Error(`Trying to serialize phase "${phase.constructor.name}", but "id" is not defined`);
        }

        const serializedPhase: SerializedPhase<Phase> = {
            id: id,
            state: phase.state
        };

        if (phase.child) {
            serializedPhase.child = this.serializePhase(phase.child);
        }

        return serializedPhase;
    }

    private deserializePhase<Phase extends AnyPhase>(parent: AnyPhase | null, phaseClass: PhaseClass<Phase>, serializedPhase: SerializedPhase<Phase>): Phase {
        const phase = new phaseClass(parent);
        phase.state = serializedPhase.state;

        if (serializedPhase.child) {
            if (!phaseClass.childPhaseClasses) {
                throw new Error(`Serialized phase contains a child, but the phase definition does not contain "childPhaseClasses"`);
            }

            const childPhaseClass = phaseClass.childPhaseClasses.find(phaseClass => phaseClass.id == serializedPhase.child?.id);

            if (!childPhaseClass) {
                throw new Error("Could not deserialize child phase def");
            }

            const childPhase = this.deserializePhase(phase, childPhaseClass, serializedPhase.child);
            phase.child = childPhase;
        }

        return phase;
    }
}
