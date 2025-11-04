import { CreateInsuranceClaimRequest } from "../../../data/models/insurance/insuranceClaim/CreateInsuranceClaimRequest";
import { InsuranceClaimDetailResponse } from "../../../data/models/insurance/insuranceClaim/InsuranceClaimDetailResponse";
import { InsuranceClaimResponse } from "../../../data/models/insurance/insuranceClaim/InsuranceClaimResponse";

export interface InsuranceClaimRepository {
    createInsuranceClaim(request: CreateInsuranceClaimRequest): Promise<InsuranceClaimResponse>;
    getMyInsuranceClaims(): Promise<InsuranceClaimResponse[]>;
    getInsuranceClaimDetail(id: string): Promise<InsuranceClaimDetailResponse>;
}
