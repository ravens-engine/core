import { ClientAuthenticationProvider } from "./ClientAuthenticationProvider";

/**
 * A client authentication provider that reads the URL to extract
 * the authentication data to send to the server.
 * 
 * Useful for development, as it makes it easy to open multiple
 * browser tabs simulating multiple users.
 */
export class ClientURLAuthenticationProvider extends ClientAuthenticationProvider {
    userId: string;
    authToken: string;
    matchId: string;

    start(): void {
        const urlContent = location.hash.substr(1);
        const urlData = urlContent.split(".");

        this.userId = urlData[0] != "" ? urlData[0] : "1";
        this.matchId = urlData.length > 1 ? urlData[1] : "1";
        this.authToken = urlData.length > 2 ? urlData[2] : this.userId;
    }

    getAuthenticationData() {
        return {
            userId: this.userId,
            authToken: this.authToken,
            matchId: this.matchId,
        }
    }

}