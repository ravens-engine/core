export class MaxPlayersReachedError extends Error { 
    constructor(message: string) {
        super(message);
        this.name = 'MaxPlayersReachedError';
    }
}