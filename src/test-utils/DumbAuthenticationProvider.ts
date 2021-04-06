import { ClientAuthenticationProvider } from "../client-authentication-provider/ClientAuthenticationProvider";

export class DumbAuthenticationProvider extends ClientAuthenticationProvider {
    userId: string;
    authToken: string;
    matchId: string;

    constructor(userId: string, authToken: string, matchId: string) {
        super();
        
        this.userId = userId;
        this.authToken = authToken;
        this.matchId = matchId;
    }

    start(): void { }

    getAuthenticationData() {
        return {
            userId: this.userId,
            authToken: this.authToken,
            matchId: this.matchId,
        }
    }

}