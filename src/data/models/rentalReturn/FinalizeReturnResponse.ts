export interface FinalizeReturnResponse {
  bookingId: string;
  bookingStatus: string;
  actualReturnDatetime: string;
  paymentResult: PaymentResult;
  vehicleUpdate: VehicleUpdate;
}

interface PaymentResult {
  refundAmount: number;
  transactionType: string;
  walletBalanceAfter: number;
}

interface VehicleUpdate {
  vehicleId: string;
  status: string;
  currentOdometerKm: number;
  batteryHealthPercentage: number;
}
