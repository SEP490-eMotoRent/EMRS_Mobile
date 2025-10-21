import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

// ✅ DIRECT IMPORT
import { Wallet } from "./Wallet";

export class WithdrawalRequest implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public amount: number;
    public bankName: string;
    public bankAccountNumber: string;
    public bankAccountName: string;
    public status: string;
    public processedAt?: Date;
    public rejectionReason: string;
    public walletId: string;

    // ✅ 1 RELATION ADDED (LINE 18)
    public wallet: Wallet;

    constructor(
        id: string,
        amount: number,
        bankName: string,
        bankAccountNumber: string,
        bankAccountName: string,
        status: string,
        rejectionReason: string,
        walletId: string,
        // ✅ RELATION PARAM (LINE 27)
        wallet: Wallet,
        processedAt?: Date,
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
        this.amount = amount;
        this.bankName = bankName;
        this.bankAccountNumber = bankAccountNumber;
        this.bankAccountName = bankAccountName;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.walletId = walletId;

        // Optional
        this.processedAt = processedAt;

        // ✅ RELATION ASSIGNED (LINE 47)
        this.wallet = wallet;
    }

    isPending(): boolean {
        return this.status === 'Pending';
    }

    isApproved(): boolean {
        return this.status === 'Approved';
    }

    isRejected(): boolean {
        return this.status === 'Rejected';
    }

    isProcessed(): boolean {
        return !!this.processedAt;
    }

    // ✅ NEW BUSINESS METHOD
    renterName(): string {
        return this.wallet.renter.fullName();
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

export type CreateWithdrawalRequestInput = CreateEntityInput<WithdrawalRequest>;
export type UpdateWithdrawalRequestInput = UpdateEntityInput<WithdrawalRequest>;