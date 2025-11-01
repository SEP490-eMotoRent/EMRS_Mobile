export interface UpdateReceiptRequest {
    rentalReceiptId: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    returnVehicleImagesFiles: File[];
    returnCheckListFile: File;
}

