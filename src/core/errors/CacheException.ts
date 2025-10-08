export class CacheException extends Error {
    constructor(message: string) {
        super(`CacheException: ${message}`);
        this.name = 'CacheException';
    }
}