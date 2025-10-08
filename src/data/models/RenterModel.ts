import { parseISO } from 'date-fns';
import { Renter } from '../../domain/entities/Renter';

export class RenterModel {
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

    static fromJson(json: Record<string, any>): RenterModel {
        return new RenterModel({
        id: json['renter_id'] ?? '',
        email: json['email'] ?? '',
        phone: json['phone'] ?? '',
        address: json['address'] ?? '',
        dateOfBirth: json['date_of_birth'] ? parseISO(json['date_of_birth']) : new Date(),
        avatarUrl: json['avatar_url'] ?? null,
        });
    }

    toJson(): Record<string, any> {
        return {
        renter_id: this.id,
        email: this.email,
        phone: this.phone,
        address: this.address,
        date_of_birth: this.dateOfBirth.toISOString(),
        avatar_url: this.avatarUrl,
        };
    }

    toEntity(): Renter {
        return new Renter({
        id: this.id,
        email: this.email,
        phone: this.phone,
        address: this.address,
        dateOfBirth: this.dateOfBirth,
        avatarUrl: this.avatarUrl,
        });
    }

    static fromEntity(entity: Renter): RenterModel {
        return new RenterModel({
        id: entity.id,
        email: entity.email,
        phone: entity.phone,
        address: entity.address,
        dateOfBirth: entity.dateOfBirth,
        avatarUrl: entity.avatarUrl,
        });
    }

    equals(other: any): boolean {
        if (!(other instanceof RenterModel)) return false;
        return this.id === other.id && this.email === other.email && this.phone === other.phone;
    }

    get props(): any[] {
        return [this.id, this.email, this.phone];
    }
}