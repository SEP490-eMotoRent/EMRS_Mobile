import { WalletTopUpRequest } from "../../../../data/models/wallet/topUp/WalletTopUpRequest";
import { WalletTopUpResponse } from "../../../../data/models/wallet/topUp/WalletTopUpResponse";
import { WalletRepository } from "../../../repositories/wallet/WalletRepository";

export class CreateTopUpRequestUseCase {
    constructor(private walletRepository: WalletRepository) {}

    async execute(request: WalletTopUpRequest): Promise<WalletTopUpResponse> {
        return this.walletRepository.createTopUpRequest(request);
    }
}