import { TransactionResponse } from "../../../../models/transaction/TransactionResponse";

export interface TransactionRemoteDataSource {
    /**
     * Get all transactions for the current authenticated renter
     * Extracts renterId from JWT token automatically
     */
    getMyTransactions(): Promise<TransactionResponse[]>;
}