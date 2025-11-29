

export interface AssignVehicleResponse {
    id: string;
    startDatetime: string;
    endDatetime: string;
    actualReturnDatetime: string | null;
    baseRentalFee: number;
    depositAmount: number;
    rentalDays: number;
    rentalHours: number;
    lateReturnFee: number;
    averageRentalPrice: number;
    totalRentalFee: number;
    totalAmount: number;
    bookingStatus: string;
    bookingCode: string;
    vehicleModelId: string;
    renterId: string;
    vehicleId: string;
}