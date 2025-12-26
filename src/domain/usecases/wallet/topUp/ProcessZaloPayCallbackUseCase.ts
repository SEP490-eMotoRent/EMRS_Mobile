import { ZaloPayCallbackRequest } from "../../../../data/models/booking/zalo/ZaloPayCallbackRequest";
import { WalletRepository } from "../../../repositories/wallet/WalletRepository";

/**
 * Use case for processing ZaloPay payment callback
 * 
 * Flow:
 * 1. Receives callback from ZaloPay (via deep link or webhook)
 * 2. Validates checksum
 * 3. Updates transaction status
 * 4. Updates wallet balance if successful
 */
export class ProcessZaloPayCallbackUseCase {
    constructor(private repository: WalletRepository) {}

    async execute(request: ZaloPayCallbackRequest): Promise<boolean> {
        // Validate required fields
        if (!request.AppTransId || !request.Checksum) {
            throw new Error('Invalid ZaloPay callback data');
        }

        // Process callback through repository
        return this.repository.processZaloPayCallback(request);
    }
}