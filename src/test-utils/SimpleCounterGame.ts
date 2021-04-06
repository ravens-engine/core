import { Game } from "../core/Game";

interface SimpleCounterGameState {
    counter: number
}

export default class SimpleCounterGame extends Game<SimpleCounterGameState> {
    initialize(): void {
        this.state = {
            counter: 0
        };
    }

    applyAction(_userId: string, action: any): void {
        if (action.type == "increase") {
            this.state.counter++;
        }
    }
}
