export interface BookingChargingResponse {
  bookingId: string;
  bookingCode: string;
  bookingStatus: string;
  renterFullName: string;
  vehicleModelName: string;
  licensePlate: string;
  branchAddress: string;
  batteryAtHandover: number;
  lastChargingDate: string;
}
