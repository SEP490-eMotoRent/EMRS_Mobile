export interface ChangeVehicleRequest {
    notes: string;
    startOdometerKm: number;
    startBatteryPercentage: number;
    bookingId: string;
    vehicleFiles: File[];
    checkListFile: File;
    vehicleId: string;
}

