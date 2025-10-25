export interface CreateBookingRequest {
    startDatetime: string;        // ISO 8601 format
    endDatetime: string;          // ISO 8601 format
    baseRentalFee: number;
    depositAmount: number;
    rentalDays: number;
    rentalHours: number;
    rentingRate: number;
    vehicleModelId: string;
    averageRentalPrice: number;
    totalRentalFee: number;
}