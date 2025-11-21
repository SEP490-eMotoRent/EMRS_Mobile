import { WalletRepository } from '../../../domain/repositories/wallet/WalletRepository';
import { WalletRemoteDataSource } from '../../datasources/interfaces/remote/wallet/WalletRemoteDataSource';
import { VNPayCallback } from '../../models/booking/vnpay/VNPayCallback';
import { CreateWalletResponse } from '../../models/wallet/CreateWalletResponse';
import { WalletTopUpRequest } from '../../models/wallet/topUp/WalletTopUpRequest';
import { WalletTopUpResponse } from '../../models/wallet/topUp/WalletTopUpResponse';
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

    async createTopUpRequest(request: WalletTopUpRequest): Promise<WalletTopUpResponse> {
        return this.remoteDataSource.createTopUpRequest(request);
    }

    async processTopUpCallback(vnPayResponse: VNPayCallback): Promise<boolean> {
        return this.remoteDataSource.processTopUpCallback(vnPayResponse);
    }
}