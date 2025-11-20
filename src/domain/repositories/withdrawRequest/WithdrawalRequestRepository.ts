import { WithdrawalRequest } from "../../entities/financial/WithdrawalRequest";

export interface WithdrawalRequestRepository {
    createWithdrawalRequest(
        amount: number,
        bankName: string,
        bankAccountNumber: string,
        bankAccountName: string
    ): Promise<WithdrawalRequest>;

    getMyWithdrawalRequests(): Promise<WithdrawalRequest[]>;

    getWithdrawalRequestDetail(id: string): Promise<WithdrawalRequest>;

    cancelWithdrawalRequest(id: string): Promise<WithdrawalRequest>;
}