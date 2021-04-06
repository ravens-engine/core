export abstract class ClientAuthenticationProvider {
    abstract start(): void;
    abstract getAuthenticationData(): any;
}