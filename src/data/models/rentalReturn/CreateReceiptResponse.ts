export interface CreateReceiptResponse {
    bookingId: string;
    rentalReceiptId : string;
    settlement : SettlementSummary;
}


interface SettlementSummary {
    baseRentalFee: number;
    totalChargingFee: number;
    totalAdditionalFees: number;
    feesBreakdown: AdditionalFeesBreakdown;
    totalAmount: number;
    depositAmount: number;
    refundAmount: number;
}

interface AdditionalFeesBreakdown {
    damageFee: number;
    cleaningFee: number;
    lateReturnFee: number;
    crossBranchFee: number;
    excessKmFee: number;
}
       