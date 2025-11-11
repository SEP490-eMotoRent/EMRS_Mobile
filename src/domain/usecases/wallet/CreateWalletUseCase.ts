import { CreateWalletResponse } from '../../../data/models/wallet/CreateWalletResponse';
import { WalletRepository } from '../../repositories/wallet/WalletRepository';

/**
 * Use case for creating a wallet
 */
export class CreateWalletUseCase {
    constructor(private walletRepository: WalletRepository) {}

    /**
     * Executes wallet creation
     * @returns Promise with wallet creation response
     */
    async execute(): Promise<CreateWalletResponse> {
        return this.walletRepository.createWallet();
    }
}