import { InsuranceClaimDetailResponse } from "../../../../data/models/insurance/insuranceClaim/InsuranceClaimDetailResponse";
import { InsuranceClaimRepository } from "../../../repositories/insurance/InsuranceClaimRepository";

export class GetInsuranceClaimDetailUseCase {
    constructor(private repository: InsuranceClaimRepository) {}

    async execute(id: string): Promise<InsuranceClaimDetailResponse> {
        return await this.repository.getInsuranceClaimDetail(id);
    }
}