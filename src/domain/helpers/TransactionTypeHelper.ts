export class TransactionTypeHelper {
    private static readonly TRANSACTION_TYPE_MAP: Record<string, string> = {
        // Wallet transactions
        'WalletTopUp': 'Nạp tiền',
        'WalletWithdrawal': 'Rút tiền',
        
        // Booking transactions
        'BookingDeposit': 'Đặt cọc',
        'BookingRefund': 'Hoàn tiền',
        'BookingPayment': 'Thanh toán thuê xe',
        
        // Additional fees
        'LateFee': 'Phí trả xe trễ',
        'DamageFee': 'Phí hư hỏng',
        'CleaningFee': 'Phí vệ sinh',
        'ExcessKmFee': 'Phí vượt quá km',
        
        // Other
        'Refund': 'Hoàn tiền',
        'Payment': 'Thanh toán',
        'Transfer': 'Chuyển khoản',
        'Adjustment': 'Điều chỉnh',
    };

    /**
     * Convert English transaction type to Vietnamese
     * If type is unknown, returns the original English type
     */
    static toVietnamese(transactionType: string): string {
        return this.TRANSACTION_TYPE_MAP[transactionType] || transactionType;
    }

    /**
     * Check if a transaction type is income (positive amount)
     */
    static isIncomeType(transactionType: string): boolean {
        const incomeTypes = [
            'WalletTopUp',
            'BookingRefund',
            'Refund',
        ];
        return incomeTypes.includes(transactionType);
    }

    /**
     * Check if a transaction type is expense (negative amount)
     */
    static isExpenseType(transactionType: string): boolean {
        const expenseTypes = [
            'WalletWithdrawal',
            'BookingDeposit',
            'BookingPayment',
            'LateFee',
            'DamageFee',
            'CleaningFee',
            'ExcessKmFee',
        ];
        return expenseTypes.includes(transactionType);
    }

    /**
     * Alias for isIncomeType() - determines if transaction is a credit (money IN)
     * @returns true if transaction adds money to wallet, false if it removes money
     */
    static isCredit(transactionType: string): boolean {
        return this.isIncomeType(transactionType);
    }

    /**
     * Get icon name based on transaction type
     */
    static getIconName(transactionType: string): 'plus' | 'minus' {
        return this.isIncomeType(transactionType) ? 'plus' : 'minus';
    }
}