export class ServerException extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(`ServerException: ${message} (code: ${statusCode ?? 'unknown'})`);
        this.name = 'ServerException';
        this.statusCode = statusCode;
    }
}