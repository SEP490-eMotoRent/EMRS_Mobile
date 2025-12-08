export interface VehicleSwapResponse {
    bookingId: string;
    bookingStatus: string;
    message: string;
    oldVehicleId: string;
    oldVehicleLicensePlate: string;
    rentalReceiptId: string;
    totalKmDriven: number;
}