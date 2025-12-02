import { DamageType } from "../../../data/models/additionalFee/DamageTypesResponse";
import { AdditionalFeeRepository } from "../../repositories/additionalFee/AdditionalFeeRepository";

export class GetDamageTypesUseCase {
    constructor(private additionalFeeRepository: AdditionalFeeRepository) {}

    async execute(): Promise<DamageType[]> {
        const response = await this.additionalFeeRepository.getDamageTypes();
        return response.data?.options || [];
    }
}