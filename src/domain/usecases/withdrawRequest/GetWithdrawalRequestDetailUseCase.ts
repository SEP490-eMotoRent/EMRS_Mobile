import { WithdrawalRequest } from "../../entities/financial/WithdrawalRequest";
import { WithdrawalRequestRepository } from "../../repositories/withdrawRequest/WithdrawalRequestRepository";

export class GetWithdrawalRequestDetailUseCase {
    constructor(private repository: WithdrawalRequestRepository) {}

    async execute(id: string): Promise<WithdrawalRequest> {
        return this.repository.getWithdrawalRequestDetail(id);
    }
}