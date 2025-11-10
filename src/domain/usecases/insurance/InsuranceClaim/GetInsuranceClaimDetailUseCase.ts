import { InsuranceClaimRepository } from "../../../repositories/insurance/InsuranceClaimRepository";
import { InsuranceClaimDetailResponse } from "../../../../data/models/insurance/insuranceClaim/InsuranceClaimDetailResponse";

export class GetInsuranceClaimDetailUseCase {
    constructor(private repository: InsuranceClaimRepository) {}

    async execute(id: string): Promise<InsuranceClaimDetailResponse> {
        return await this.repository.getInsuranceClaimDetail(id);
    }
}