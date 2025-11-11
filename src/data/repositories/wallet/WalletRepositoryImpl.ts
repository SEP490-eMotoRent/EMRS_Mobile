import { WalletRepository } from '../../../domain/repositories/wallet/WalletRepository';
import { WalletRemoteDataSource } from '../../datasources/interfaces/remote/wallet/WalletRemoteDataSource';
import { CreateWalletResponse } from '../../models/wallet/CreateWalletResponse';
import { WalletBalanceResponse } from '../../models/wallet/WalletBalanceResponse';

/**
 * Implementation of WalletRepository
 * Delegates to remote data source
 */
export class WalletRepositoryImpl implements WalletRepository {
    constructor(private remoteDataSource: WalletRemoteDataSource) {}

    async createWallet(): Promise<CreateWalletResponse> {
        return this.remoteDataSource.createWallet();
    }

    async getMyBalance(): Promise<WalletBalanceResponse> {
        return this.remoteDataSource.getMyBalance();
    }
}