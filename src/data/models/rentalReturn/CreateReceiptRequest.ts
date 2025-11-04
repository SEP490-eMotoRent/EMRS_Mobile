export interface CreateReceiptRequest {
    bookingId: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImageUrls: string[];
    checkListImage: File;
    additionalFees: AdditionalFeesBreakdown[];
}

export interface AdditionalFeesBreakdown {
    feeType : string;
    amount: number;
    description: string;
}