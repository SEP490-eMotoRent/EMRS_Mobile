import { Transaction } from "../../entities/financial/Transaction";
import { TransactionRepository } from "../../repositories/financial/TransactionRepository";

export class GetMyTransactionsUseCase {
    constructor(private repository: TransactionRepository) {}

    async execute(): Promise<Transaction[]> {
        return await this.repository.getMyTransactions();
    }
}