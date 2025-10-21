import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";
import { Booking } from "./Booking";

export class AdditionalFee implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public feeType: string;
    public description: string;
    public amount: number;
    public bookingId: string;

    // ✅ RELATION
    public booking: Booking;

    constructor(
        id: string,
        feeType: string,
        description: string,
        amount: number,
        bookingId: string,
        booking: Booking,  // ✅ ADDED
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

        this.feeType = feeType;
        this.description = description;
        this.amount = amount;
        this.bookingId = bookingId;

        // ✅ RELATION
        this.booking = booking;
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

export type CreateAdditionalFeeInput = CreateEntityInput<AdditionalFee>;
export type UpdateAdditionalFeeInput = UpdateEntityInput<AdditionalFee>;