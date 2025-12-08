export interface CreateReceiptRequest {
    bookingId: string;
    returnReceiptId: string;
    actualReturnDatetime: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImageUrls: string[];
    checkListImage: File;
}