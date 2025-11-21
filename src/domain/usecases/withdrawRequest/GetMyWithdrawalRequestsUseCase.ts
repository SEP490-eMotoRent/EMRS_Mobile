import { WithdrawalRequest } from "../../entities/financial/WithdrawalRequest";
import { WithdrawalRequestRepository } from "../../repositories/withdrawRequest/WithdrawalRequestRepository";

export class GetMyWithdrawalRequestsUseCase {
    constructor(private repository: WithdrawalRequestRepository) {}

    async execute(): Promise<WithdrawalRequest[]> {
        return this.repository.getMyWithdrawalRequests();
    }
}