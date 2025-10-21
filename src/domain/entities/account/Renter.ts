import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

import { Account } from "./Account";
import { Wallet } from "../financial/Wallet";
import { Document } from "./Document";
import { Booking } from "../booking/Booking";
import { Feedback } from "../booking/Feedback";
import { InsuranceClaim } from "../insurance/InsuranceClaim";
import { Membership } from "../financial/Membership";

export class Renter implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public email: string;
    public phone: string;
    public address: string;
    public dateOfBirth?: string;
    public avatarUrl: string;
    public accountId: string;
    public membershipId: string;
    public isVerified: boolean;
    public verificationCode: string;
    public verificationCodeExpiry?: Date;

    // ✅ RELATIONS ADDED HERE (LINE 25-31)
    public account: Account;
    public wallet?: Wallet;
    public documents: Document[] = [];
    public bookings: Booking[] = [];
    public feedbacks: Feedback[] = [];
    public insuranceClaims: InsuranceClaim[] = [];
    public membership: Membership;

    constructor(
        id: string,
        email: string,
        phone: string,
        address: string,
        avatarUrl: string,
        accountId: string,
        membershipId: string,
        account: Account,           // ✅ ADDED
        membership: Membership,    // ✅ ADDED
        isVerified: boolean = false,
        verificationCode: string = '',
        dateOfBirth?: string,
        verificationCodeExpiry?: Date,
        wallet?: Wallet,           // ✅ ADDED
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

        // Required fields
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.avatarUrl = avatarUrl;
        this.accountId = accountId;
        this.membershipId = membershipId;
        this.isVerified = isVerified;
        this.verificationCode = verificationCode;

        // Optional fields
        this.dateOfBirth = dateOfBirth;
        this.verificationCodeExpiry = verificationCodeExpiry;

        // ✅ RELATIONS ASSIGNED (LINE 58-61)
        this.account = account;
        this.membership = membership;
        this.wallet = wallet;
    }

    // BUSINESS METHODS - UPDATED
    fullName(): string {
        return this.account.fullname || this.email;  // ✅ USES RELATION
    }

    isVerificationExpired(): boolean {
        if (!this.verificationCodeExpiry) return true;
        return new Date() > this.verificationCodeExpiry;
    }

    totalBookings(): number {          // ✅ NEW METHOD
        return this.bookings.length;
    }

    averageRating(): number {          // ✅ NEW METHOD
        return this.feedbacks.length ? 
            this.feedbacks.reduce((sum, f) => sum + f.rating, 0) / this.feedbacks.length : 0;
    }

    // SOFT DELETE
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

export type CreateRenterInput = CreateEntityInput<Renter>;
export type UpdateRenterInput = UpdateEntityInput<Renter>;