export interface UpdateReturnReceiptResponse {
    bookingId: string;
    rentalReceiptId: string;
    updateSummary: {
        odometerUpdated: boolean;
        batteryUpdated: boolean;
        notesUpdated: boolean;
        imagesReplaced: boolean;
        newImagesCount: number;
        checklistReplaced: boolean;
    };
    newSettlement: {
        totalChargingFee: number;
        totalAdditionalFees: number;
        feesBreakdown: {
            damageFee: number;
            damageDetails: string | null;
            cleaningFee: number;
            lateReturnFee: number;
            lateReturnDetails: string | null;
        };
        crossBranchFee: number;
        crossBranchDetails: string | null;
        excessKmFee: number;
        excessKmDetails: string | null;
    };
}