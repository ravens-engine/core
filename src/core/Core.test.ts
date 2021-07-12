import SimpleCounterGame from "../test-utils/SimpleCounterGame";
import { BeforeStartPhase, GameEndedPhase, GameStartedPhase, ThreePhaseGame } from "../test-utils/ThreePhaseGame";
import { Core } from "./Core";
import { InvalidStatusError } from "./errors/InvalidStatusError";
import { MaxPlayersReachedError } from "./errors/MaxPlayersReachedError";
import { PlayerAlreadyInGameError } from "./errors/PlayerAlreadyInGameError";
import { PlayerNotInGameError } from "./errors/PlayerNotInGameError";
import { Game } from "./Game";
import { GameStatus } from "./GameStatus";

describe("Core", () => {
    it("initializes the state correctly", () => {
        const core = new Core("1", "Name", SimpleCounterGame);

        expect(core.game).toBeInstanceOf(SimpleCounterGame);
        expect(core.game.state).toEqual ({counter: 0});
    });

    it("correctly processes actions", () => {
        const core = new Core("1", "Name", SimpleCounterGame);

        core.applyAction("1", {type: "increase"});

        expect(core.game.state.counter).toEqual(1);
    });

    it("changes to an other phase correctly", () => {
        const core = new Core("1", "Name", ThreePhaseGame);

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

    it("starts to the IN_LOBBY status", () => {
        const core = new Core("1", "Name", ThreePhaseGame);

        expect(core.status).toBe(GameStatus.IN_LOBBY);
    });

    it("correctly changes to a new status", () => {
        const core = new Core("1", "Name", ThreePhaseGame);

        core.applyAction("1", {
            type: "start"
        });

        expect(core.status).toBe(GameStatus.STARTED);
    });

    it("doesn't allow invalid change of status", () => {
        class StatusChangeGame extends Game {
            applyAction(_userId: string, action: any): void {
                if (action.type == "change") {
                    this.setStatus(GameStatus.FINISHED);
                }
            }
        }

        const core = new Core("1", "Name", StatusChangeGame);

        core.applyAction("1", {
            type: "start"
        });

        expect(() => core.applyAction("1", {type: "change"})).toThrowError(InvalidStatusError);
    });

    it("adds and removes players", () => {
        class PlayerChangeGame extends Game {
            applyAction(userId: string, action: any): void {
                if (action.type == "add-me") {
                    this.addPlayer(userId);
                } else if (action.type == "remove-me") {
                    this.removePlayer(userId);
                }
            }
        }

        const core = new Core("1", "Name", PlayerChangeGame);

        core.applyAction("1", {
            type: "add-me"
        });

        expect(core.players).toEqual(["1"]);

        core.applyAction("2", {
            type: "add-me"
        });

        expect(core.players).toEqual(["1", "2"]);

        expect(() => core.applyAction("1", {type: "add-me"})).toThrowError(PlayerAlreadyInGameError);

        expect(() => core.applyAction("3", {type: "remove-me"})).toThrowError(PlayerNotInGameError);

        core.applyAction("1", {
            type: "remove-me"
        });

        expect(core.players).toEqual(["2"]);
    });

    it("correctly set 2 as the default maxPlayers value", () => {
        const core = new Core("1", "Name", ThreePhaseGame);

        expect(core.maxPlayers).toBe(2);
    });

    it("correctly modifies maxPlayers when setMaxPlayers is called", () => {
        class MaxPlayersChangeGame extends Game {
            applyAction(userId: string, action: any): void {
                if (action.type == "change") {
                    this.setMaxPlayers(action.maxPlayers);
                }
            }
        }

        const core = new Core("1", "Name", MaxPlayersChangeGame);

        core.applyAction("1", {
            type: "change",
            maxPlayers: 5
        });

        expect(core.maxPlayers).toBe(5);
    });

    it("correctly doesn't allow a player to be added if there are already maxPlayers players in the game", () => {
        class PlayerChangeGame extends Game {
            applyAction(userId: string, action: any): void {
                if (action.type == "add-me") {
                    this.addPlayer(userId);
                } else if (action.type == "remove-me") {
                    this.removePlayer(userId);
                }
            }
        }

        const core = new Core("1", "Name", PlayerChangeGame);

        core.applyAction("1", {
            type: "add-me"
        });

        core.applyAction("2", {
            type: "add-me"
        });

        expect(() => core.applyAction("3", {type: "add-me"})).toThrowError(MaxPlayersReachedError);
    });
});