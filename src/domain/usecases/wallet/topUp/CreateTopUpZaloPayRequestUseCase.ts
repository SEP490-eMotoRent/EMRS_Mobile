import { WalletTopUpRequest } from "../../../../data/models/wallet/topUp/WalletTopUpRequest";
import { WalletTopUpZaloPayResponse } from "../../../../data/models/wallet/topUp/WalletTopUpZaloPayResponse";
import { WalletRepository } from "../../../repositories/wallet/WalletRepository";


/**
 * Use case for creating a ZaloPay wallet top-up request
 * 
 * Flow:
 * 1. Validates amount
 * 2. Creates transaction in backend
 * 3. Returns ZaloPay payment URL
 * 4. User completes payment in ZaloPay app
 * 5. Backend processes callback
 */
export class CreateTopUpZaloPayRequestUseCase {
    constructor(private repository: WalletRepository) {}

    async execute(request: WalletTopUpRequest): Promise<WalletTopUpZaloPayResponse> {
        // Validate amount
        if (request.amount < 10000) {
            throw new Error('Số tiền nạp tối thiểu là 10.000đ');
        }

        if (request.amount > 50000000) {
            throw new Error('Số tiền nạp tối đa là 50.000.000đ');
        }

        // Create ZaloPay top-up request
        return this.repository.createTopUpZaloPayRequest(request);
    }
}