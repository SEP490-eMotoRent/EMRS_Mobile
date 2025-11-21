import { WalletResponse } from "../wallet/WalletResponse";

export interface WithdrawalRequestDetailResponse {
    id: string;
    amount: number;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    status: string;
    createdAt: string;
    processedAt?: string;
    rejectionReason?: string;
    walletId: string;
    wallet: WalletResponse;
}