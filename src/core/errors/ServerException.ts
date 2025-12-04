export class ServerException extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(`${message} (code: ${statusCode ?? 'unknown'})`);
        this.name = '';
        this.statusCode = statusCode;
    }
}