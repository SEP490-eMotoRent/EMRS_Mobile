import { Transaction } from "../../../domain/entities/financial/Transaction";
import { TransactionRepository } from "../../../domain/repositories/financial/TransactionRepository";
import { TransactionRemoteDataSource } from "../../datasources/interfaces/remote/transaction/TransactionRemoteDataSource";
import { TransactionResponse } from "../../models/transaction/TransactionResponse";

export class TransactionRepositoryImpl implements TransactionRepository {
    constructor(private remote: TransactionRemoteDataSource) {}

    async getMyTransactions(): Promise<Transaction[]> {
        try {
            const responses = await this.remote.getMyTransactions();
            return responses.map(this.mapToEntity);
        } catch (error) {
            throw error;
        }
    }

    private mapToEntity(response: TransactionResponse): Transaction {
        return new Transaction(
            response.id,
            response.transactionType,
            response.amount,
            response.docNo,
            response.status,
            new Date(response.createdAt)
        );
    }
}