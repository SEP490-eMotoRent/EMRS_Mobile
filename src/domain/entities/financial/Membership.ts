import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

// ✅ DIRECT IMPORT
import { Renter } from "../account/Renter";

export class Membership implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public tierName: string;
    public minBookings: number;
    public discountPercentage: number;
    public freeChargingPerMonth: number;
    public description: string;

    // ✅ 1 RELATION ADDED (LINE 15)
    public renters: Renter[] = [];

    constructor(
        id: string,
        tierName: string,
        minBookings: number,
        discountPercentage: number,
        freeChargingPerMonth: number,
        description: string,
        // ✅ RELATION PARAM (LINE 23)
        renters: Renter[] = [],
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;

        this.tierName = tierName;
        this.minBookings = minBookings;
        this.discountPercentage = discountPercentage;
        this.freeChargingPerMonth = freeChargingPerMonth;
        this.description = description;

        // ✅ RELATION ASSIGNED (LINE 38)
        this.renters = renters;
    }

    applyDiscount(price: number): number {
        return price * (1 - this.discountPercentage / 100);
    }

    hasEnoughBookings(bookings: number): boolean {
        return bookings >= this.minBookings;
    }

    // ✅ NEW BUSINESS METHOD
    totalMembers(): number {
        return this.renters.length;
    }

    delete(): void {
        this.updatedAt = new Date();
        this.deletedAt = new Date();
        this.isDeleted = true;
    }

    restore(): void {
        this.updatedAt = new Date();
        this.deletedAt = null;
        this.isDeleted = false;
    }
}

export type CreateMembershipInput = CreateEntityInput<Membership>;
export type UpdateMembershipInput = UpdateEntityInput<Membership>;