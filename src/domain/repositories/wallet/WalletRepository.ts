import { VNPayCallback } from "../../../data/models/booking/vnpay/VNPayCallback";
import { CreateWalletResponse } from "../../../data/models/wallet/CreateWalletResponse";
import { WalletTopUpRequest } from "../../../data/models/wallet/topUp/WalletTopUpRequest";
import { WalletTopUpResponse } from "../../../data/models/wallet/topUp/WalletTopUpResponse";
import { WalletBalanceResponse } from "../../../data/models/wallet/WalletBalanceResponse";

/**
 * Repository interface for Wallet domain operations
 */
export interface WalletRepository {
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