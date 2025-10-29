export interface BookingForStaffResponse {
    id: string;
    startDatetime?: Date;
    endDatetime?: Date;
    actualReturnDatetime?: Date;
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
    renter: RenterBookingResponse; // ✅ Nested
    vehicle: VehicleBookingResponse; // ✅ Nested
    vehicleModel: VehicleModelBookingResponse; // ✅ Nested
}

export interface RenterBookingResponse {
    id: string;
    email?: string;
    phone?: string; // ✅ Note: backend has lowercase 'phone'
    address?: string;
    dateOfBirth?: string;
    account?: AccountBookingResponse; // ✅ Nested
}

export interface AccountBookingResponse {
    id: string;
    username?: string;
    role?: string;
    fullname?: string; // ✅ Note: backend has lowercase 'fullname'
}

export interface VehicleBookingResponse {
    id: string;
    color: string;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    licensePlate: string;
    nextMaintenanceDue?: Date;
    fileUrl?: string[];
    rentalPricing?: number; // ✅ This is the rental price, not ID
    vehicleModel?: VehicleModelBookingResponse; // ✅ Nested
}

export interface VehicleModelBookingResponse {
    id: string;
    modelName?: string;
    category?: string;
    batteryCapacityKwh?: number;
    maxRangeKm?: number;
    maxSpeedKmh?: number;
}