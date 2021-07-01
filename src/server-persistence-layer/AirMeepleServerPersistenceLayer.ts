import axios, { AxiosInstance, AxiosResponse } from "axios";
import { SerializedCore } from "../core/Core";
import { GameStatus } from "../core/GameStatus";
import { AnyGame } from "../core/Phase";
import { UserData } from "../core/PlayerData";
import { PersistedMatchData, ServerPersistenceLayer } from "./ServerPersistenceLayer";

export class AirMeepleServerPersistenceLayer extends ServerPersistenceLayer {
    client: AxiosInstance;

    baseUrl: string;
    gameId: string;
    username: string;
    password: string;

    public constructor(baseUrl: string, gameId: string, username: string, password: string) {
        super();
        this.baseUrl = baseUrl;
        this.gameId = gameId;
        this.username = username;
        this.password = password;
    }

    async start(): Promise<void> {
        this.server.logger.info("initializing airmeeple client", {baseUrl: this.baseUrl, gameId: this.gameId});
        this.client = axios.create({
            baseURL: this.baseUrl,
            auth: {
                username: this.username,
                password: this.password
            }
        });
    }

    async authenticateUser(userId: string, matchId: string, authToken: string): Promise<UserData | null> {
        let response: AxiosResponse<GetUserResponse>;
        try {
            this.server.logger.info("calling POST /user/{}/{}", {userId, matchId});
            response = await this.client.get<GetUserResponse>("/user/" + userId + "/" + matchId);
        } catch (e) {
            if (e.response && e.response.status == 404) {
                // No user found
                this.server.logger.info("request returned 404", {response: e.response.data});
                return null;
            } else {
                throw e;
            }
        }

        const {name, auth_token: receivedAuthToken} = response.data;

        if (authToken != receivedAuthToken) {
            this.server.logger.info("wrong auth token", {userId});
            return null;
        }

        return {
            id: userId,
            name,
            connected: false
        }
    }

    async getMatch(matchId: string): Promise<PersistedMatchData | null> {
        try {
            this.server.logger.info("calling GET /match/{}", {matchId});
            const response = await this.client.get<GetMatchResponse>("/match/" + matchId);

            const {id, name, status, players, serialized_match: serializedMatch} = response.data;
            const castedStatus = status as GameStatus;
    
            return {
                id,
                name,
                status: castedStatus,
                serializedMatch,
                players,
            };
        } catch (e) {
            if (e.response && e.response.status == 404) {
                // No game found
                this.server.logger.info("request returned 404", {response: e.response.data});
                return null;
            } else {
                throw e;
            }
        }
    }

    async saveMatch(serializedCore: SerializedCore<AnyGame>): Promise<void> {
        const {id} = serializedCore;
        
        this.server.logger.info("calling /match/{}", {id});

        await this.client.patch(
            "/match/" + id,
            {
                status: serializedCore.status,
                players: serializedCore.players,
                serialized_match: serializedCore.serializedGame,
            } 
        );
    }
    
}

interface GetUserResponse {
    id: string,
    name: string,
    auth_token: string,
}

interface GetMatchResponse {
    id: string,
    name: string,
    status: string,
    players: string[],
    serialized_match: object,
}