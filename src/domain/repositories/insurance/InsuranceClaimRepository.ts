import { CreateInsuranceClaimRequest } from "../../../data/models/insurance/CreateInsuranceClaimRequest";
import { InsuranceClaimDetailResponse } from "../../../data/models/insurance/InsuranceClaimDetailResponse";
import { InsuranceClaimResponse } from "../../../data/models/insurance/InsuranceClaimResponse";

export interface InsuranceClaimRepository {
    createInsuranceClaim(request: CreateInsuranceClaimRequest): Promise<InsuranceClaimResponse>;
    getMyInsuranceClaims(): Promise<InsuranceClaimResponse[]>;
    getInsuranceClaimDetail(id: string): Promise<InsuranceClaimDetailResponse>;
}
