import { ApiResponse } from "../../../core/network/APIResponse";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export class SignContractUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(contractId: string, otpCode: string): Promise<ApiResponse<string>> {
        return await this.receiptRepo.signContract(contractId, otpCode);
    }
}
