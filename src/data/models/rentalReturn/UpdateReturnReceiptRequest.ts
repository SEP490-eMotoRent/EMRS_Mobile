export interface UpdateReturnReceiptRequest {
    bookingId: string;
    rentalReceiptId: string;
    actualReturnDatetime: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImageUrls: string[];
    checkListImage: File;
}