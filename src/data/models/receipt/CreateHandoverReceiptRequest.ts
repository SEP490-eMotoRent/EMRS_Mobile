export interface CreateHandoverReceiptRequest {
    notes: string;
    startOdometerKm: number;
    startBatteryPercentage: number;
    bookingId: string;
    vehicleFiles: File[];
    checkListFile: File;
}

