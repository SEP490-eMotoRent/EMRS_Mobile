export interface WithdrawalRequestResponse {
    id: string;
    amount: number;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    status: string;
    createdAt: string;
    processedAt?: string;
    rejectionReason?: string;
}