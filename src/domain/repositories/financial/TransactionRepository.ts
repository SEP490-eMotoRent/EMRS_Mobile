import { Transaction } from "../../entities/financial/Transaction";

export interface TransactionRepository {
    /**
     * Get all transactions for the current authenticated renter
     */
    getMyTransactions(): Promise<Transaction[]>;
}