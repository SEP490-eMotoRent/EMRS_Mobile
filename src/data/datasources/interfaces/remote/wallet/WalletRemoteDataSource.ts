import { VNPayCallback } from "../../../../models/booking/vnpay/VNPayCallback";
import { CreateWalletResponse } from "../../../../models/wallet/CreateWalletResponse";
import { WalletTopUpRequest } from "../../../../models/wallet/topUp/WalletTopUpRequest";
import { WalletTopUpResponse } from "../../../../models/wallet/topUp/WalletTopUpResponse";
import { WalletBalanceResponse } from "../../../../models/wallet/WalletBalanceResponse";

/**
 * Remote data source interface for Wallet operations
 */
export interface WalletRemoteDataSource {
    /**
     * Creates a new wallet for the current renter
     * @returns Promise with wallet creation response
     */
    createWallet(): Promise<CreateWalletResponse>;

    /**
     * Gets the balance of the current renter's wallet
     * @returns Promise with wallet balance response
     */
    getMyBalance(): Promise<WalletBalanceResponse>;

    createTopUpRequest(request: WalletTopUpRequest): Promise<WalletTopUpResponse>;
    processTopUpCallback(vnPayResponse: VNPayCallback): Promise<boolean>;
}