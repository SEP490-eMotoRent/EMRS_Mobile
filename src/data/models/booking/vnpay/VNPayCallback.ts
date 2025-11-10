export interface VNPayCallback {
    isSuccess: boolean;
    orderId: string;
    transactionId: string;
    amount: number;
    responseCode: string;
    message: string;
    bankCode: string;
    bankTransactionNo: string;
    cardType: string;
    transactionDate: string; // ISO format
}