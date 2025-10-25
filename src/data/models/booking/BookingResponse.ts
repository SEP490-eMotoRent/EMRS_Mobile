export interface BookingResponse {
    bookingId: string;
    startDatetime: string;
    endDatetime: string;
    baseRentalFee: number;
    depositAmount: number;
    rentalDays: number;
    rentalHours: number;
    rentingRate: number;
    averageRentalPrice: number;
    totalRentalFee: number;
    totalAmount: number;
    bookingStatus: string;
    renterId: string;
    vehicleId: string;
    vehicleModelId: string;
    insurancePackageId?: string;
    handoverBranchId?: string;
    returnBranchId?: string;
    createdAt: string;
}