// src/data/datasources/interfaces/remote/withdrawRequest/WithdrawalRequestRemoteDataSource.ts
import { CreateWithdrawalRequest } from "../../../../models/withdrawRequest/CreateWithdrawalRequest";
import { WithdrawalRequestDetailResponse } from "../../../../models/withdrawRequest/WithdrawalRequestDetailResponse";
import { WithdrawalRequestResponse } from "../../../../models/withdrawRequest/WithdrawalRequestResponse";

export interface WithdrawalRequestRemoteDataSource {
    createWithdrawalRequest(
        request: CreateWithdrawalRequest
    ): Promise<WithdrawalRequestResponse>;

    getMyWithdrawalRequests(): Promise<WithdrawalRequestResponse[]>;

    getWithdrawalRequestDetail(
        id: string
    ): Promise<WithdrawalRequestDetailResponse>;

    cancelWithdrawalRequest(
        id: string
    ): Promise<WithdrawalRequestResponse>;
}