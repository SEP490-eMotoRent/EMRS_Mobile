import { Failure } from './Failure';

export class ServerFailure extends Failure {
    constructor(message: string) {
        super(message);
    }
}
