import { CreateWalletResponse } from "../../../data/models/wallet/CreateWalletResponse";
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
}