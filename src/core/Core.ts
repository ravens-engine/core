import _ from "lodash";
import * as winston from "winston";
import { InvalidStatusError } from "./errors/InvalidStatusError";
import { MaxPlayersReachedError } from "./errors/MaxPlayersReachedError";
import { PlayerAlreadyInGameError } from "./errors/PlayerAlreadyInGameError";
import { PlayerNotInGameError } from "./errors/PlayerNotInGameError";
import { GameStatus } from "./GameStatus";
import { Phase, AnyPhase, PhaseClass, AnyGame } from "./Phase";
import { SerializedGame } from "./SerializedGame";
import { SerializedPhase } from "./SerializedPhase";

interface UserData {
    id: string,
    name: string,
}

export class Core<Game extends AnyGame> {
    id: string;
    name: string;

    gameClass: PhaseClass<Game>;
    game: Game;
    logger: winston.Logger;

    status: GameStatus;
    players: string[];
    maxPlayers: number;

    onStateChange: () => void;

    constructor(
        id: string,
        name: string,
        gameClass: PhaseClass<Game>,
        logger: winston.Logger | null = null,
        serializedGame: SerializedGame<Game> | null = null,
        status: GameStatus = GameStatus.IN_LOBBY,
        maxPlayers: number = 2,
        players: string[] = [],
    ) {
        this.id = id;
        this.name = name;
        this.gameClass = gameClass;
        this.logger = logger ? logger : winston.createLogger();
        this.players = players;
        this.status = status;
        this.maxPlayers = maxPlayers;

        if (serializedGame == null) {
            this.game = new gameClass(this, null);
        } else {
            // @ts-expect-error serializedGame acting weirdly
            this.game = this.deserializePhase(null, this.gameClass, serializedGame);
        }


        if (serializedGame == null) {
            this.game.initialize(null);
        } else {
            this.callRecursivelyOnGame(phase => phase.onDeserialize());
        }
    }

    fireUserConnectionEvent(userId: string): void {
        this.callRecursivelyOnGame(phase => phase.onUserConnection(userId));
    }

    fireUserDisconnectionEvent(userId: string): void {
        this.callRecursivelyOnGame(phase => phase.onUserDisconnection(userId));
    }

    public serializeCore(): SerializedCore<Game> {
        // Serialiazing a game is serializing the root phase,
        // adding some data and removing the unecessary "id" property
        // of the game.
        const serializedCore: SerializedCore<Game> = {
            id: this.id,
            name: this.name,
            serializedGame: _.omit(this.serializePhase(this.game), "id"),
            status: this.status,
            maxPlayers: this.maxPlayers,
            players: this.players,
        };

        return serializedCore;
    }

    setStatus(status: GameStatus): void {
        // Check if the new status respects the status flow
        const currentStatus = this.status;
        let invalidNewStatus = false;
        if (currentStatus == GameStatus.IN_LOBBY) {
            if (status != GameStatus.CLOSED && status != GameStatus.STARTED) {
                invalidNewStatus = true;
            }
        } else if (currentStatus == GameStatus.STARTED) {
            if (status != GameStatus.CANCELLED && status != GameStatus.FINISHED) {
                invalidNewStatus = true;
            }
        } else {
            invalidNewStatus = true;
        }

        if (invalidNewStatus) {
            throw new InvalidStatusError(`Invalid status given, can't switch from "${this.status}" to "${status}"`);
        }

        this.status = status;
    }

    addPlayer(userId: string): void {
        if (this.players.indexOf(userId) != -1) {
            throw new PlayerAlreadyInGameError(`Player "${userId}" is already a player`);
        }

        if (this.players.length == this.maxPlayers) {
            throw new MaxPlayersReachedError(`There are already ${this.players.length} players, when maxPlayers is already at ${this.maxPlayers}`);
        }

        this.players.push(userId);
    }

    removePlayer(userId: string): void {
        if (this.players.indexOf(userId) == -1) {
            throw new PlayerNotInGameError(`Tried to remove player "${userId}", who is not a player`);
        }

        this.players = _.without(this.players, userId);
    }

    setMaxPlayers(maxPlayers: number): void {
        if (maxPlayers <= 0) {
            throw new RangeError(`maxPlayers must be > 0, ${maxPlayers} was given`);
        }

        if (maxPlayers < this.players.length) {
            throw new RangeError(`maxPlayers can't be inferior than the current number of players, ${maxPlayers} was given`);
        }

        this.maxPlayers = maxPlayers;
    }

    applyAction(userId: string, action: object): void {
        this.callRecursivelyOnGame(phase => phase.applyAction(userId, action));
    }

    private callRecursivelyOnGame(callback: (phase: AnyPhase) => void) {
        this.callRecursivelyOnPhase(this.game, callback);

        if (this.onStateChange) {
            this.onStateChange();
        }
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
            state: _.cloneDeep(phase.state)
        };

        if (phase.child) {
            serializedPhase.child = this.serializePhase(phase.child);
        }

        return serializedPhase;
    }

    private deserializePhase<Phase extends AnyPhase>(parent: AnyPhase | null, phaseClass: PhaseClass<Phase>, serializedPhase: SerializedPhase<Phase>): Phase {
        const phase = new phaseClass(this, parent);
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

    static deserializeCore<Game extends AnyGame>(gameClass: PhaseClass<Game>, logger: winston.Logger | null = null, serializedCore: SerializedCore<Game>): Core<Game> {
        return new Core(
            serializedCore.id,
            serializedCore.name,
            gameClass,
            logger,
            serializedCore.serializedGame,
            serializedCore.status,
            serializedCore.maxPlayers,
            serializedCore.players,
        );
    }
}

export interface SerializedCore<Game extends AnyGame> {
    id: string,
    name: string,
    serializedGame: SerializedGame<Game>;
    status: GameStatus;
    maxPlayers: number;
    players: string[];
}
