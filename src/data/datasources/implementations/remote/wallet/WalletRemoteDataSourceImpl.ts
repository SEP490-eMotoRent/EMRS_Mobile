import { ApiEndpoints } from '../../../../../core/network/APIEndpoint';
import { ApiResponse, unwrapResponse } from '../../../../../core/network/APIResponse';
import { AxiosClient } from '../../../../../core/network/AxiosClient';
import { CreateWalletResponse } from '../../../../models/wallet/CreateWalletResponse';
import { WalletBalanceResponse } from '../../../../models/wallet/WalletBalanceResponse';
import { WalletRemoteDataSource } from '../../../interfaces/remote/wallet/WalletRemoteDataSource';

/**
 * Implementation of WalletRemoteDataSource
 * Handles HTTP requests for wallet operations
 */
export class WalletRemoteDataSourceImpl implements WalletRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async createWallet(): Promise<CreateWalletResponse> {
        const response = await this.axiosClient.post<ApiResponse<CreateWalletResponse>>(
        ApiEndpoints.wallet.create
        );
        return unwrapResponse(response.data);
    }

    async getMyBalance(): Promise<WalletBalanceResponse> {
        const response = await this.axiosClient.get<ApiResponse<WalletBalanceResponse>>(
        ApiEndpoints.wallet.myBalance
        );
        return unwrapResponse(response.data);
    }
}