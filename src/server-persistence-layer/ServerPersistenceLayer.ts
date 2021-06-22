import { SerializedCore } from "../core/Core";
import { GameStatus } from "../core/GameStatus";
import { AnyGame } from "../core/Phase";
import { UserData } from "../core/UserData";
import { Server } from "../server/Server";

export interface PersistedMatchData {
    id: string,
    name: string,
    status: GameStatus,
    serializedMatch: object | null,
    players: string[],
}

export abstract class ServerPersistenceLayer {
    server: Server<AnyGame>;

    abstract start(): Promise<void>;
    abstract authenticateUser(userId: string, matchId: string, authToken: string): Promise<UserData | null>;
    abstract getMatch(matchId: string): Promise<PersistedMatchData | null>;
    abstract saveMatch(seriaizedCore: SerializedCore<AnyGame>): Promise<void>;
}