import { CreateInsuranceClaimRequest } from "../../../data/models/insurance/CreateInsuranceClaimRequest";
import { InsuranceClaimResponse } from "../../../data/models/insurance/InsuranceClaimResponse";
import { InsuranceClaimRepository } from "../../repositories/insurance/InsuranceClaimRepository";

export class CreateInsuranceClaimUseCase {
    constructor(private repository: InsuranceClaimRepository) {}

    async execute(request: CreateInsuranceClaimRequest): Promise<InsuranceClaimResponse> {
        return await this.repository.createInsuranceClaim(request);
    }
}