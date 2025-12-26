import { VNPayCallback } from '../../../data/models/booking/vnpay/VNPayCallback';
import { ZaloPayCallbackRequest } from '../../../data/models/booking/zalo/ZaloPayCallbackRequest';
import { CreateWalletResponse } from '../../../data/models/wallet/CreateWalletResponse';
import { WalletTopUpRequest } from '../../../data/models/wallet/topUp/WalletTopUpRequest';
import { WalletTopUpResponse } from '../../../data/models/wallet/topUp/WalletTopUpResponse';
import { WalletTopUpZaloPayResponse } from '../../../data/models/wallet/topUp/WalletTopUpZaloPayResponse';
import { WalletBalanceResponse } from '../../../data/models/wallet/WalletBalanceResponse';

/**
 * Repository interface for wallet operations
 * Defines contract for wallet-related business logic
 */
export interface WalletRepository {
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