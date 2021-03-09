import SimpleCounterGame from "../test-utils/SimpleCounterGame";
import { BeforeStartPhase, GameEndedPhase, GameStartedPhase, ThreePhaseGame } from "../test-utils/ThreePhaseGame";
import { Core } from "./Core";

describe("Core", () => {
    it("initializes the state correctly", () => {
        const core = new Core(SimpleCounterGame);

        expect(core.game).toBeInstanceOf(SimpleCounterGame);
        expect(core.game.state).toEqual ({counter: 0});
    });

    it("correctly processes actions", () => {
        const core = new Core(SimpleCounterGame);

        core.applyAction("1", {type: "increase"});

        expect(core.game.state.counter).toEqual(1);
    });

    it("changes to an other phase correctly", () => {
        const core = new Core(ThreePhaseGame);

        expect(core.game.child).toBeInstanceOf(BeforeStartPhase);

        core.applyAction("1", {
            type: "start"
        });

        expect(core.game.child).toBeInstanceOf(GameStartedPhase);

        core.applyAction("1", {
            type: "win"
        });

        expect(core.game.child).toBeInstanceOf(GameEndedPhase);
    });
});