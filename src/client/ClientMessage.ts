export type ClientMessage = SendAction | Authenticate;

interface SendAction<> {
    type: "send-action",
    action: object,
}

interface Authenticate {
    type: "authenticate",
    authenticationData: {
        userId: string,
        authToken: string,
        matchId: string
    }
}
