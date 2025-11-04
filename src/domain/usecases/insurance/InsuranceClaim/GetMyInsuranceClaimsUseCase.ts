import { InsuranceClaimResponse } from "../../../../data/models/insurance/insuranceClaim/InsuranceClaimResponse";
import { InsuranceClaimRepository } from "../../../repositories/insurance/InsuranceClaimRepository";

export class GetMyInsuranceClaimsUseCase {
    constructor(private repository: InsuranceClaimRepository) {}

    async execute(): Promise<InsuranceClaimResponse[]> {
        return await this.repository.getMyInsuranceClaims();
    }
}
