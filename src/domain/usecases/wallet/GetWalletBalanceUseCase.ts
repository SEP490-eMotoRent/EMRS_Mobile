import { WalletBalanceResponse } from '../../../data/models/wallet/WalletBalanceResponse';
import { WalletRepository } from '../../repositories/wallet/WalletRepository';

/**
 * Use case for getting wallet balance
 */
export class GetWalletBalanceUseCase {
    constructor(private walletRepository: WalletRepository) {}

    /**
     * Executes wallet balance retrieval
     * @returns Promise with wallet balance response
     */
    async execute(): Promise<WalletBalanceResponse> {
        return this.walletRepository.getMyBalance();
    }
}