export interface CreateReceiptRequest {
    bookingId: string;
    actualReturnDatetime: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImageUrls: string[];
    checkListImage: File;
}