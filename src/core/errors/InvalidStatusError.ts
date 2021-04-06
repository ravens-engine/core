export class InvalidStatusError extends Error { 
    constructor(message: string) {
        super(message);
        this.name = 'InvalidStatusError';
    }
}