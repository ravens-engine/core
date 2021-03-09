import { Children } from "react";
import { Game } from "./Game";

export type AnyPhase = Phase<any, any, any, any, any>;

export interface PhaseClass<Phase> {
    id: string;
    childPhaseClasses?: PhaseClass<AnyPhase>[];

    new(parent: AnyPhase | null): NonNullable<Phase>;
}

export type AnyGame = Game<any, any, any>;

export abstract class Phase<State = any, Action = any, InitArgs = null, Parent extends (AnyPhase | null) = null, Child extends AnyPhase | null = null> {
    static id: string;
    static childPhaseClasses: PhaseClass<AnyPhase>[];
    
    state: State;
    parent: Parent;
    child: Child;

    constructor(parent: Parent) {
        this.parent = parent;
    }

    initialize(args: InitArgs) { }

    applyAction(playerId: string, action: Action) { }

    setChild<SpecificChild extends Child>(phaseClass: PhaseClass<SpecificChild>, args: object | null = null): void {
        this.child = new phaseClass(this);
        
        this.child.initialize(args);
    }

    onDeserialize() {  }
}