export class PlayerNotInGameError extends Error { 
    constructor(message: string) {
        super(message);
        this.name = 'PlayerNotInGameError';
    }
}