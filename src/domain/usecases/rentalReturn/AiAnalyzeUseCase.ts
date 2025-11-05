import { ApiResponse } from "../../../core/network/APIResponse";
import { AnalyzeReturnResponse } from "../../../data/models/rentalReturn/AnalyzeReturnResponse";
import { RentalReturnRepository } from "../../repositories/rentalReturn/RentalReturnRepository";

export interface AiAnalyzeUseCaseInput {
    bookingId: string;
    returnImages: string[];
}

export class AiAnalyzeUseCase {
    constructor(private rentalReturnRepository: RentalReturnRepository) {}
    
    async execute(input: AiAnalyzeUseCaseInput): Promise<ApiResponse<AnalyzeReturnResponse>> {
        return await this.rentalReturnRepository.analyzeReturn(input);
    }
}
