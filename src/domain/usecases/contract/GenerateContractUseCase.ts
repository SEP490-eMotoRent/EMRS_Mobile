import { ApiResponse } from "../../../core/network/APIResponse";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export class GenerateContractUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(input: string): Promise<ApiResponse<string>> {
        return await this.receiptRepo.generateContract(input);
    }
}
