export class InvalidActionError extends Error { 
    constructor(message: string) {
        super(message);
        this.name = 'InvalidActionError';
    }
}