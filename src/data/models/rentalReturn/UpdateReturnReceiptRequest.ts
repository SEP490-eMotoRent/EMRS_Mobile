export interface UpdateReturnReceiptRequest {
    bookingId: string;
    rentalReceiptId: string;
    actualReturnDatetime: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImages: File[];
    checkListImage: File;
}