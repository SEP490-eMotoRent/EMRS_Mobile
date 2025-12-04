import { AdditionalFeeRepository } from "../../repositories/additionalFee/AdditionalFeeRepository";
import { ApiResponse } from "../../../core/network/APIResponse";
import { AddFeeDamageRequest } from "../../../data/models/additionalFee/AddFeeDamageRequest";

export class AddDamageFeeUseCase {
    constructor(private additionalFeeRepository: AdditionalFeeRepository) {}

    async execute(request: AddFeeDamageRequest): Promise<ApiResponse<any>> {
        return await this.additionalFeeRepository.addDamageFee(request);
    }
}