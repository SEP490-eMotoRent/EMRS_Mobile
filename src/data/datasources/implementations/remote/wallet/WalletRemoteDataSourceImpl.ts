import { ApiEndpoints } from '../../../../../core/network/APIEndpoint';
import { ApiResponse, unwrapResponse } from '../../../../../core/network/APIResponse';
import { AxiosClient } from '../../../../../core/network/AxiosClient';
import { VNPayCallback } from '../../../../models/booking/vnpay/VNPayCallback';
import { ZaloPayCallbackRequest } from '../../../../models/booking/zalo/ZaloPayCallbackRequest';
import { CreateWalletResponse } from '../../../../models/wallet/CreateWalletResponse';
import { WalletTopUpRequest } from '../../../../models/wallet/topUp/WalletTopUpRequest';
import { WalletTopUpResponse } from '../../../../models/wallet/topUp/WalletTopUpResponse';
import { WalletTopUpZaloPayResponse } from '../../../../models/wallet/topUp/WalletTopUpZaloPayResponse';
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

    async createTopUpZaloPayRequest(request: WalletTopUpRequest): Promise<WalletTopUpZaloPayResponse> {
        try {
            // console.log('📤 [ZaloPay] Creating top-up request:', request);
            
            const response = await this.axiosClient.post<ApiResponse<WalletTopUpZaloPayResponse>>(
                ApiEndpoints.wallet.topUpZaloPay,
                request
            );

            const data = unwrapResponse(response.data);
            
            // console.log('📥 [ZaloPay] Top-up response:', {
            //     transactionId: data.transactionId,
            //     amount: data.amount,
            //     zaloPayUrl: data.zaloPayUrl,
            // });

            return data;
        } catch (error: any) {
            // console.error('❌ [ZaloPay] Create top-up request failed:', error);
            throw error;
        }
    }

    async processTopUpCallback(vnPayResponse: VNPayCallback): Promise<boolean> {
        const response = await this.axiosClient.put<ApiResponse<boolean>>(
            ApiEndpoints.wallet.vnPayCallback,
            vnPayResponse
        );
        return unwrapResponse(response.data);
    }

    async processZaloPayCallback(zaloPayResponse: ZaloPayCallbackRequest): Promise<boolean> {
        try {
            // console.log('📤 [ZaloPay Callback] Request:', zaloPayResponse);

            const response = await this.axiosClient.put<ApiResponse<boolean>>(
                ApiEndpoints.wallet.zaloPayCallback,
                zaloPayResponse
            );

            const result = unwrapResponse(response.data);
            
            // console.log('✅ [ZaloPay Callback] Success:', result);
            return result;
        } catch (error: any) {
            // console.error('❌ [ZaloPay Callback] Failed:', error);
            throw error;
        }
    }
}