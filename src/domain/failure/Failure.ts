export abstract class Failure {
    readonly message: string;

    constructor(message: string) {
        this.message = message;
    }

    // Equality check similar to Equatable
    equals(other: any): boolean {
        if (other === null || other === undefined || !(other instanceof Failure)) {
        return false;
        }
        return this.message === other.message;
    }

    // Properties for equality comparison
    get props(): any[] {
        return [this.message];
    }

    toString(): string {
        return `${this.constructor.name}: ${this.message}`;
    }
}