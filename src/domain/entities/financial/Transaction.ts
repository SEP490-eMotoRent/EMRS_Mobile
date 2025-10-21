import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

export class Transaction implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public transactionType: string;
    public amount: number;
    public docNo: string;
    public description: string;
    public status: string;
    public transactionDate?: Date;

    constructor(
        id: string,
        transactionType: string,
        amount: number,
        docNo: string,
        description: string,
        status: string,
        transactionDate?: Date,
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
        this.transactionType = transactionType;
        this.amount = amount;
        this.docNo = docNo;
        this.description = description;
        this.status = status;

        // Optional
        this.transactionDate = transactionDate;
    }

    isCompleted(): boolean {
        return this.status === 'Completed';
    }

    isIncome(): boolean {
        return this.amount > 0;
    }

    isExpense(): boolean {
        return this.amount < 0;
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

export type CreateTransactionInput = CreateEntityInput<Transaction>;
export type UpdateTransactionInput = UpdateEntityInput<Transaction>;