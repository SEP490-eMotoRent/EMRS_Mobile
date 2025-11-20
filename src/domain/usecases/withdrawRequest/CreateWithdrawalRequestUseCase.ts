import { WithdrawalRequest } from "../../entities/financial/WithdrawalRequest";
import { WithdrawalRequestRepository } from "../../repositories/withdrawRequest/WithdrawalRequestRepository";

export class CreateWithdrawalRequestUseCase {
    constructor(private repository: WithdrawalRequestRepository) {}

    async execute(
        amount: number,
        bankName: string,
        bankAccountNumber: string,
        bankAccountName: string
    ): Promise<WithdrawalRequest> {
        return this.repository.createWithdrawalRequest(
            amount,
            bankName,
            bankAccountNumber,
            bankAccountName
        );
    }
}