import { Game } from "../core/Game";
import { Phase } from "../core/Phase";

export class BeforeStartPhase extends Phase<null, null, null, ThreePhaseGame> {
    static id = "before-start";

    applyAction(playerId: string, action: any) {
        if (action["type"] == "start") {
            this.parent.setChild(GameStartedPhase);
        }
    }
}

export class GameStartedPhase extends Phase<null, null, null, ThreePhaseGame> {
    static id = "game-started";

    applyAction(playerId: string, action: any) {
        if (action.type == "win") {
            this.parent.setChild(GameEndedPhase);
        }
    }
}

export class GameEndedPhase extends Phase<null, null, null, ThreePhaseGame> {
    static id = "game-ended";
}

export class ThreePhaseGame extends Game<null, null, BeforeStartPhase | GameStartedPhase | GameEndedPhase> {
    static id = "three-phase-game";
    static childPhaseClasses = [BeforeStartPhase, GameStartedPhase, GameEndedPhase];

    initialize() {
        this.setChild(BeforeStartPhase);
    }
}