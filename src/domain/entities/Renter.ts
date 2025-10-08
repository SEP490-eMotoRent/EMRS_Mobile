export class Renter {
    readonly id: string;
    readonly email: string;
    readonly phone: string;
    readonly address: string;
    readonly dateOfBirth: Date;
    readonly avatarUrl?: string | null;

    constructor({
        id,
        email,
        phone,
        address,
        dateOfBirth,
        avatarUrl,
    }: {
        id: string;
        email: string;
        phone: string;
        address: string;
        dateOfBirth: Date;
        avatarUrl?: string | null;
    }) {
        this.id = id;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.avatarUrl = avatarUrl;
    }

    equals(other: any): boolean {
        if (!(other instanceof Renter)) return false;
        return (
        this.id === other.id &&
        this.email === other.email &&
        this.phone === other.phone &&
        this.address === other.address &&
        this.dateOfBirth.getTime() === other.dateOfBirth.getTime() &&
        this.avatarUrl === other.avatarUrl
        );
    }

    get props(): any[] {
        return [
        this.id,
        this.email,
        this.phone,
        this.address,
        this.dateOfBirth,
        this.avatarUrl,
        ];
    }
}