import { VNPayCallback } from "../../../../data/models/booking/vnpay/VNPayCallback";
import { WalletRepository } from "../../../repositories/wallet/WalletRepository";

export class ProcessTopUpCallbackUseCase {
    constructor(private walletRepository: WalletRepository) {}

    async execute(vnPayResponse: VNPayCallback): Promise<boolean> {
        return this.walletRepository.processTopUpCallback(vnPayResponse);
    }
}