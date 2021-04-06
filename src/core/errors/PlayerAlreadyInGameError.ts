export class PlayerAlreadyInGameError extends Error { 
    constructor(message: string) {
        super(message);
        this.name = 'PlayerAlreadyInGameError';
    }
}