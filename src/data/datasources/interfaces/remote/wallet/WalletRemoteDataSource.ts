import { CreateWalletResponse } from "../../../../models/wallet/CreateWalletResponse";
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
}