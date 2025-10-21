import { Failure } from './Failure';

export class CacheFailure extends Failure {
    constructor(message: string) {
        super(message);
    }
}