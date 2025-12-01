export interface HandoverReceiptResponse {
    id: string;
    notes: string;
    renterConfirmedAt: string | null;
    startOdometerKm: number;
    startBatteryPercentage: number;
    bookingId: string;
    staffId: string;
    endOdometerKm: number;
    handOverVehicleImageFiles: string[];
    returnVehicleImageFiles: string[];
    checkListFile: string;
}
