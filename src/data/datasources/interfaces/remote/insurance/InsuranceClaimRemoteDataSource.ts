import { CreateInsuranceClaimRequest } from "../../../../models/insurance/CreateInsuranceClaimRequest";
import { InsuranceClaimDetailResponse } from "../../../../models/insurance/InsuranceClaimDetailResponse";
import { InsuranceClaimResponse } from "../../../../models/insurance/InsuranceClaimResponse";

export interface InsuranceClaimRemoteDataSource {
    createInsuranceClaim(request: CreateInsuranceClaimRequest): Promise<InsuranceClaimResponse>;
    getMyInsuranceClaims(): Promise<InsuranceClaimResponse[]>;
    getInsuranceClaimDetail(id: string): Promise<InsuranceClaimDetailResponse>;
}