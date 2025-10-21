import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';
import { Booking } from "./Booking";

export class RentalContract implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public contractNumber: string;
    public contractTerms: string;
    public otpCode: string;
    public expireAt?: Date;
    public contractStatus: string;
    public contractPdfUrl: string;
    public bookingId: string;

    // ✅ RELATION
    public booking: Booking;

    constructor(
        id: string,
        contractNumber: string,
        contractTerms: string,
        otpCode: string,
        contractStatus: string,
        contractPdfUrl: string,
        bookingId: string,
        booking: Booking,  // ✅ ADDED
        expireAt?: Date,
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

        this.contractNumber = contractNumber;
        this.contractTerms = contractTerms;
        this.otpCode = otpCode;
        this.contractStatus = contractStatus;
        this.contractPdfUrl = contractPdfUrl;
        this.bookingId = bookingId;

        // ✅ RELATION
        this.booking = booking;

        this.expireAt = expireAt;
    }

    isExpired(): boolean {
        return !!this.expireAt && new Date() > this.expireAt;
    }

    isActive(): boolean {
        return this.contractStatus === 'Active' && !this.isExpired();
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

export type CreateRentalContractInput = CreateEntityInput<RentalContract>;
export type UpdateRentalContractInput = UpdateEntityInput<RentalContract>;