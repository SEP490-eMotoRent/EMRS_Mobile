export interface ChargingListResponse {
  bookingId: string;
  bookingCode: string;
  branchAddress: string;
  branchName: string;
  chargingDate: string;
  endBatteryPercentage: number;
  fee: number;
  kwhCharged: number;
  licensePlate: string;
  notes: string;
  ratePerKwh: number;
  staffName: string;
  startBatteryPercentage: number;
  timeSlot: string;
  vehicleModelName: string;
}
