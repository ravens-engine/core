import { SerializedCore } from "../core/Core";
import { GameStatus } from "../core/GameStatus";
import { AnyGame } from "../core/Phase";
import { UserData } from "../core/UserData";
import { PersistedMatchData, ServerPersistenceLayer } from "./ServerPersistenceLayer";

export class DumbServerPersistenceLayer extends ServerPersistenceLayer {
    async start(): Promise<void> {
        // Do nothing
    }

    authenticateUser(userId: string, _matchId: string, _authToken: string): Promise<UserData | null> {
        // Always authenticate the user
        return Promise.resolve({
            id: userId,
            name: userId,
            connected: false
        });
    }

    async getMatch(matchId: string): Promise<PersistedMatchData> {
        return {
            id: matchId,
            status: GameStatus.IN_LOBBY,
            name: "Match #" + matchId,
            serializedMatch: null,
            maxPlayers: 0,
            players: []
        };
    }

    async saveMatch(_serializedCore: SerializedCore<AnyGame>): Promise<void> {
        // Do nothing
    }
    
}