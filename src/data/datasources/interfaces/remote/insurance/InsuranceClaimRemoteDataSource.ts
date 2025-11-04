import { CreateInsuranceClaimRequest } from "../../../../models/insurance/insuranceClaim/CreateInsuranceClaimRequest";
import { InsuranceClaimDetailResponse } from "../../../../models/insurance/insuranceClaim/InsuranceClaimDetailResponse";
import { InsuranceClaimResponse } from "../../../../models/insurance/insuranceClaim/InsuranceClaimResponse";

export interface InsuranceClaimRemoteDataSource {
    createInsuranceClaim(request: CreateInsuranceClaimRequest): Promise<InsuranceClaimResponse>;
    getMyInsuranceClaims(): Promise<InsuranceClaimResponse[]>;
    getInsuranceClaimDetail(id: string): Promise<InsuranceClaimDetailResponse>;
}