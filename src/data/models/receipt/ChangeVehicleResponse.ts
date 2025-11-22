export interface ChangeVehicleResponse {
    id: string;
    bookingId: string;
    checkListFile: string;
    endBatteryPercentage: number;
    endOdometerKm: number;
    handOverVehicleImageFiles: string[];
    notes: string;
    renterConfirmedAt: string | null;
    returnVehicleImageFiles: string[];
    staffId: string;
    startBatteryPercentage: number;
    startOdometerKm: number;
    vehicleId: string;
    vehicleModelId: string;
}

