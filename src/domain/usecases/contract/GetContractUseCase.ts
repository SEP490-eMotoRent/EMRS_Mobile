import { RentalContract } from "../../entities/booking/RentalContract";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export class GetContractUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(input: string): Promise<RentalContract | null> {
        return await this.receiptRepo.getContract(input);
    }
}
