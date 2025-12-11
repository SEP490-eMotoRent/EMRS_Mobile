export class ServerException extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(`${message})`);
        this.name = '';
        this.statusCode = statusCode;
    }
}