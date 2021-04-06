import { Game } from "../core/Game";
import { GameStatus } from "../core/GameStatus";
import { Phase } from "../core/Phase";

export class BeforeStartPhase extends Phase<null, null, null, ThreePhaseGame> {
    static id = "before-start";

    applyAction(_userId: string, action: any): void {
        if (action["type"] == "start") {
            this.parent.setChild(GameStartedPhase);
        }
    }
}

export class GameStartedPhase extends Phase<null, null, null, ThreePhaseGame> {
    static id = "game-started";

    initialize(): void {
        this.setStatus(GameStatus.STARTED);
    }

    applyAction(_userId: string, action: any): void {
        if (action.type == "win") {
            this.parent.setChild(GameEndedPhase);
        }
    }
}

export class GameEndedPhase extends Phase<null, null, null, ThreePhaseGame> {
    static id = "game-ended";

    initialize(): void {
        this.setStatus(GameStatus.FINISHED);
    }
}

export class ThreePhaseGame extends Game<null, null, BeforeStartPhase | GameStartedPhase | GameEndedPhase> {
    static id = "three-phase-game";
    static childPhaseClasses = [BeforeStartPhase, GameStartedPhase, GameEndedPhase];

    initialize(): void {
        this.setChild(BeforeStartPhase);
    }
}