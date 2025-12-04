import { AddFeeNormalRequest } from "../../../data/models/additionalFee/AddFeeNormalRequest";
import { AdditionalFeeRepository } from "../../repositories/additionalFee/AdditionalFeeRepository";
import { ApiResponse } from "../../../core/network/APIResponse";

export class AddCleaningFeeUseCase {
    constructor(private additionalFeeRepository: AdditionalFeeRepository) {}

    async execute(request: AddFeeNormalRequest): Promise<ApiResponse<any>> {
        return await this.additionalFeeRepository.addCleaningFee(request);
    }
}