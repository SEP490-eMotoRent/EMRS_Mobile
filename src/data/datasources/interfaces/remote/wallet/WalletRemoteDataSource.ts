import { VNPayCallback } from '../../../../models/booking/vnpay/VNPayCallback';
import { ZaloPayCallbackRequest } from '../../../../models/booking/zalo/ZaloPayCallbackRequest';
import { CreateWalletResponse } from '../../../../models/wallet/CreateWalletResponse';
import { WalletTopUpRequest } from '../../../../models/wallet/topUp/WalletTopUpRequest';
import { WalletTopUpResponse } from '../../../../models/wallet/topUp/WalletTopUpResponse';
import { WalletTopUpZaloPayResponse } from '../../../../models/wallet/topUp/WalletTopUpZaloPayResponse';
import { WalletBalanceResponse } from '../../../../models/wallet/WalletBalanceResponse';

/**
 * Interface for wallet remote data source
 * Defines contract for HTTP operations
 */
export interface WalletRemoteDataSource {
    /**
     * Creates a new wallet for the current user
     */
    createWallet(): Promise<CreateWalletResponse>;

    /**
     * Gets the current user's wallet balance
     */
    getMyBalance(): Promise<WalletBalanceResponse>;

    /**
     * Creates a VNPay top-up request
     * @param request - Amount to top up
     * @returns VNPay payment URL and transaction details
     */
    createTopUpRequest(request: WalletTopUpRequest): Promise<WalletTopUpResponse>;

    /**
     * Creates a ZaloPay top-up request
     * @param request - Amount to top up
     * @returns ZaloPay payment URL and transaction details
     */
    createTopUpZaloPayRequest(request: WalletTopUpRequest): Promise<WalletTopUpZaloPayResponse>;

    /**
     * Processes VNPay payment callback
     * @param vnPayResponse - Callback data from VNPay
     * @returns Success status
     */
    processTopUpCallback(vnPayResponse: VNPayCallback): Promise<boolean>;

    /**
     * Processes ZaloPay payment callback
     * @param zaloPayResponse - Callback data from ZaloPay
     * @returns Success status
     */
    processZaloPayCallback(zaloPayResponse: ZaloPayCallbackRequest): Promise<boolean>;
}