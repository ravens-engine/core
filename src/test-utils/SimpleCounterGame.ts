import { Game } from "../core/Game";
import { Phase } from "../core/Phase";

interface SimpleCounterGameState {
    counter: number
}

export default class SimpleCounterGame extends Game<SimpleCounterGameState> {
    initialize() {
        this.state = {
            counter: 0
        };
    }

    applyAction(playerId: string, action: any) {
        if (action.type == "increase") {
            this.state.counter++;
        }
    }
}
