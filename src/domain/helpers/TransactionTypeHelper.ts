export class TransactionTypeHelper {
    private static readonly TRANSACTION_TYPE_MAP: Record<string, string> = {
        // Booking transactions
        'BookingDeposit': 'Đặt Xe',
        'BookingRefund': 'Hoàn Tiền Đặt Xe',
        'BookingAdditionalPayment': 'Thanh Toán Phụ Phí',
        'BookingReturnRefund': 'Hoàn Tiền Trả Xe',
        
        // Wallet transactions
        'WalletTopUp': 'Nạp Tiền Vào Ví',
        'WalletWithdraw': 'Rút Tiền Khỏi Ví',
        
        // Insurance Claim transactions
        'InsuranceClaimPayment': 'Thanh Toán Bảo Hiểm',
        'InsuranceClaimRefund': 'Hoàn Tiền Bảo Hiểm',
    };

    /**
     * Convert English transaction type to Vietnamese
     * If type is unknown, returns the original English type
     */
    static toVietnamese(transactionType: string): string {
        return this.TRANSACTION_TYPE_MAP[transactionType] || transactionType;
    }

    /**
     * Check if a transaction type is income (positive amount - money IN)
     * All refunds and top-ups are income
     */
    static isIncomeType(transactionType: string): boolean {
        const incomeTypes = [
            'WalletTopUp',              // User adds money
            'BookingRefund',            // User gets deposit back
            'BookingReturnRefund',      // User gets refund when returning bike
            'InsuranceClaimRefund',     // User gets insurance refund
        ];
        return incomeTypes.includes(transactionType);
    }

    /**
     * Check if a transaction type is expense (negative amount - money OUT)
     * All deposits, payments, and withdrawals are expenses
     */
    static isExpenseType(transactionType: string): boolean {
        const expenseTypes = [
            'BookingDeposit',           // User pays deposit
            'BookingAdditionalPayment', // User pays additional fees
            'WalletWithdraw',           // User withdraws money
            'InsuranceClaimPayment',    // User pays for insurance claim
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
     * Alias for isExpenseType() - determines if transaction is a debit (money OUT)
     * @returns true if transaction removes money from wallet, false if it adds money
     */
    static isDebit(transactionType: string): boolean {
        return this.isExpenseType(transactionType);
    }

    /**
     * Get icon name based on transaction type
     */
    static getIconName(transactionType: string): 'plus' | 'minus' {
        return this.isIncomeType(transactionType) ? 'plus' : 'minus';
    }

    /**
     * Get color based on transaction type
     * @returns green for income, red for expense
     */
    static getColor(transactionType: string): { positive: string; negative: string } {
        return this.isIncomeType(transactionType) 
            ? { positive: '#4ade80', negative: '#f87171' }
            : { positive: '#4ade80', negative: '#f87171' };
    }
}