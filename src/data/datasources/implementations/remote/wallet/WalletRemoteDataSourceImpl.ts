import { ApiEndpoints } from '../../../../../core/network/APIEndpoint';
import { ApiResponse, unwrapResponse } from '../../../../../core/network/APIResponse';
import { AxiosClient } from '../../../../../core/network/AxiosClient';
import { VNPayCallback } from '../../../../models/booking/vnpay/VNPayCallback';
import { CreateWalletResponse } from '../../../../models/wallet/CreateWalletResponse';
import { WalletTopUpRequest } from '../../../../models/wallet/topUp/WalletTopUpRequest';
import { WalletTopUpResponse } from '../../../../models/wallet/topUp/WalletTopUpResponse';
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

    async createTopUpRequest(request: WalletTopUpRequest): Promise<WalletTopUpResponse> {
        const response = await this.axiosClient.post<ApiResponse<WalletTopUpResponse>>(
            ApiEndpoints.wallet.topUp,
            request
        );
        return unwrapResponse(response.data);
    }

    async processTopUpCallback(vnPayResponse: VNPayCallback): Promise<boolean> {
        const response = await this.axiosClient.put<ApiResponse<boolean>>(
            ApiEndpoints.wallet.vnPayCallback,
            vnPayResponse
        );
        return unwrapResponse(response.data);
    }
}