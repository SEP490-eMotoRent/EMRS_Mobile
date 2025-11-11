import { InsuranceClaimRepository } from "../../../repositories/insurance/InsuranceClaimRepository";
import { InsuranceClaimResponse } from "../../../../data/models/insurance/insuranceClaim/InsuranceClaimResponse";

export class GetMyInsuranceClaimsUseCase {
    constructor(private repository: InsuranceClaimRepository) {}

    async execute(): Promise<InsuranceClaimResponse[]> {
        return await this.repository.getMyInsuranceClaims();
    }
}