import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

// ✅ DIRECT IMPORTS
import { Renter } from "../account/Renter";
import { WithdrawalRequest } from "./WithdrawalRequest";

export class Wallet implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public balance: number;
    public renterId: string;

    // ✅ 2 RELATIONS ADDED (LINE 13-14)
    public renter: Renter;
    public withdrawalRequests: WithdrawalRequest[] = [];

    constructor(
        id: string,
        renterId: string,
        renter: Renter,                    // ✅ ADDED
        balance: number = 0,
        withdrawalRequests: WithdrawalRequest[] = [],  // ✅ ADDED
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

        this.balance = balance;
        this.renterId = renterId;

        // ✅ RELATIONS ASSIGNED (LINE 31-32)
        this.renter = renter;
        this.withdrawalRequests = withdrawalRequests;
    }

    topUp(amount: number): void {
        if (amount <= 0) throw new Error('Top-up amount must be positive');
        this.balance += amount;
        this.updatedAt = new Date();
    }

    withdraw(amount: number): void {
        if (amount > this.balance) throw new Error('Insufficient balance');
        if (amount <= 0) throw new Error('Withdrawal amount must be positive');
        this.balance -= amount;
        this.updatedAt = new Date();
    }

    canWithdraw(amount: number): boolean {
        return this.balance >= amount && amount > 0;
    }

    hasSufficientFunds(amount: number): boolean {
        return this.balance >= amount;
    }

    // ✅ NEW BUSINESS METHOD
    renterName(): string {
        return this.renter.fullName();
    }

    pendingWithdrawals(): number {
        return this.withdrawalRequests.filter(w => w.isPending()).reduce((sum, w) => sum + w.amount, 0);
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

export type CreateWalletInput = CreateEntityInput<Wallet>;
export type UpdateWalletInput = UpdateEntityInput<Wallet>;