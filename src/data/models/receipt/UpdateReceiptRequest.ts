export interface UpdateReceiptRequest {
    id: string;
    startOdometerKm: number;
    startBatteryPercentage: number;
    vehicleFiles: File[];
    checkListFile: File;
    notes: string;
}

