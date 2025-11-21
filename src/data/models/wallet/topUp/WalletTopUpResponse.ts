export interface WalletTopUpResponse {
    transactionId: string;
    amount: number;
    transactionCode: string;
    status: string;
    vnPayUrl: string;
    createdAt: string; // ISO format
}