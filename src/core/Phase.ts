import { Core } from "./Core";
import { Game } from "./Game";
import { GameStatus } from "./GameStatus";

export type AnyPhase = Phase<any, any, any, any, any>;

export interface PhaseClass<Phase> {
    id: string;
    childPhaseClasses?: PhaseClass<AnyPhase>[];

    new(core: Core<AnyGame>, parent: AnyPhase | null): NonNullable<Phase>;
}

export type AnyGame = Game<any, any, any>;

export abstract class Phase<State = any, Action = any, InitArgs = null, Parent extends (AnyPhase | null) = null, Child extends AnyPhase | null = null> {
    static id: string;
    static childPhaseClasses: PhaseClass<AnyPhase>[];

    core: Core<AnyGame>;
    
    state: State;
    parent: Parent;
    child: Child;

    get game(): AnyGame {
        // By convention, the root of the phase tree is the game
        // To get the game, recursively climb up the tree
        if (this.parent != null) {
            return this.parent.game;
        } else {
            // @ts-expect-error TS doesn't like this casting
            return this as AnyGame;
        }
    }

    get players(): string[] {
        return this.core.players;
    }

    constructor(core: Core<AnyGame>, parent: Parent) {
        this.core = core;
        this.parent = parent;
    }

    addPlayer(_playerId: string): void {
        this.core.addPlayer(_playerId);
    }

    removePlayer(_playerId: string): void {
        this.core.removePlayer(_playerId);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initialize(_args: InitArgs): void { }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    applyAction(_userId: string, _action: Action): void { }

    setChild<SpecificChild extends Child>(phaseClass: PhaseClass<SpecificChild>, args: object | null = null): void {
        this.child = new phaseClass(this.core, this);
        
        this.child.initialize(args);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDeserialize(): void {  }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onUserConnection(_userId: string): void {  }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onUserDisconnection(_userId: string): void {  }

    setStatus(status: GameStatus): void {
        this.core.setStatus(status);
    }

    setMaxPlayers(maxPlayers: number): void {
        this.core.setMaxPlayers(maxPlayers);
    }
}