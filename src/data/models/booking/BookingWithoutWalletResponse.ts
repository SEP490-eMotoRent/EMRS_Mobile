export interface BookingWithoutWalletResponse {
    id: string;
    // bookingCode: string;
    startDatetime?: string;
    endDatetime?: string;
    actualReturnDatetime?: string;
    baseRentalFee: number;
    depositAmount: number;
    rentalDays: number;
    rentalHours: number;
    rentingRate: number;
    lateReturnFee: number;
    averageRentalPrice: number;
    totalRentalFee: number;
    totalAmount: number;
    bookingStatus: string;
    vehicleModelId: string;
    renterId: string;
    vehicleId?: string;
    vnpayUrl: string;
}