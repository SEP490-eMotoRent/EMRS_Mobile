import { ApiResponse } from "../../../core/network/APIResponse";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export class GenerateOtpContractUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(contractId: string): Promise<ApiResponse<string>> {
        return await this.receiptRepo.generateOtp(contractId);
    }
}
