export interface CreateChargingRecordRequest {
    bookingId: string;
    chargingDate: string;
    startBatteryPercentage: number;
    endBatteryPercentage: number;
    kwhCharged: number;
    notes: string;
  }
  