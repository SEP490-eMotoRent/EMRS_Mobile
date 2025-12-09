export interface VehicleSwapRequest {
    bookingId: string;
    returnReceiptId: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImageUrls: string[];
    checkListImage: File;
}