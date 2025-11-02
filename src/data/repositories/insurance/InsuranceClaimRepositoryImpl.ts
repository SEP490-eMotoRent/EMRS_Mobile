import { InsuranceClaimRepository } from "../../../domain/repositories/insurance/InsuranceClaimRepository";
import { InsuranceClaimRemoteDataSource } from "../../datasources/interfaces/remote/insurance/InsuranceClaimRemoteDataSource";
import { CreateInsuranceClaimRequest } from "../../models/insurance/CreateInsuranceClaimRequest";
import { InsuranceClaimDetailResponse } from "../../models/insurance/InsuranceClaimDetailResponse";
import { InsuranceClaimResponse } from "../../models/insurance/InsuranceClaimResponse";

export class InsuranceClaimRepositoryImpl implements InsuranceClaimRepository {
    constructor(private remoteDataSource: InsuranceClaimRemoteDataSource) {}

    async createInsuranceClaim(request: CreateInsuranceClaimRequest): Promise<InsuranceClaimResponse> {
        return await this.remoteDataSource.createInsuranceClaim(request);
    }

    async getMyInsuranceClaims(): Promise<InsuranceClaimResponse[]> {
        return await this.remoteDataSource.getMyInsuranceClaims();
    }

    async getInsuranceClaimDetail(id: string): Promise<InsuranceClaimDetailResponse> {
        return await this.remoteDataSource.getInsuranceClaimDetail(id);
    }
}