// src/data/repositories/withdrawRequest/WithdrawalRequestRepositoryImpl.ts
import { WithdrawalRequest } from "../../../domain/entities/financial/WithdrawalRequest";
import { WithdrawalRequestRepository } from "../../../domain/repositories/withdrawRequest/WithdrawalRequestRepository";
import { WithdrawalRequestRemoteDataSource } from "../../datasources/interfaces/remote/withdrawRequest/WithdrawalRequestRemoteDataSource";
import { WithdrawalRequestMapper } from "../../mappers/WithdrawalRequestMapper";

export class WithdrawalRequestRepositoryImpl implements WithdrawalRequestRepository {
    constructor(private remoteDataSource: WithdrawalRequestRemoteDataSource) {}

    async createWithdrawalRequest(
        amount: number,
        bankName: string,
        bankAccountNumber: string,
        bankAccountName: string
    ): Promise<WithdrawalRequest> {
        const data = await this.remoteDataSource.createWithdrawalRequest({
            amount,
            bankName,
            bankAccountNumber,
            bankAccountName,
        });
        return WithdrawalRequestMapper.toDomain(data);
    }

    async getMyWithdrawalRequests(): Promise<WithdrawalRequest[]> {
        const data = await this.remoteDataSource.getMyWithdrawalRequests();
        return WithdrawalRequestMapper.toDomainList(data);
    }

    async getWithdrawalRequestDetail(id: string): Promise<WithdrawalRequest> {
        const data = await this.remoteDataSource.getWithdrawalRequestDetail(id);
        return WithdrawalRequestMapper.toDetailDomain(data);
    }

    async cancelWithdrawalRequest(id: string): Promise<WithdrawalRequest> {
        const data = await this.remoteDataSource.cancelWithdrawalRequest(id);
        return WithdrawalRequestMapper.toDomain(data);
    }
}