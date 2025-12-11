export interface BookingResponseForRenter {
    id: string;
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
    bookingCode: string;
    vehicleModelId: string;
    renterId: string;
    vehicle: VehicleResponse;
    vehicleId?: string;
    // Nested objects
    vehicleModel: VehicleModelResponse;
    renter: RenterDetailResponse;
    insurancePackage?: InsurancePackageResponse;
    vehicleModelmediaResponse?: VehicleModelMediaResponse; // ✅ NEW
}

export interface VehicleResponse {
    id: string;
    licensePlate: string;
    color: string;
    yearOfManufacture: string;
    currentOdometerKm: number;
}

export interface VehicleModelResponse {
    id: string;
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;
    maxSpeedKmh: number;
    description: string;
}

export interface RenterDetailResponse {
    id: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth?: string;
    account: BookingDetailAccountResponse;
}

export interface BookingDetailAccountResponse {
    id: string;
    username: string;
    role: string;
    fullname?: string;
}

export interface InsurancePackageResponse {
    id: string;
    packageName: string;
    packageFee: number;
    coveragePersonLimit: number;
    coveragePropertyLimit: number;
    coverageVehiclePercentage: number;
    coverageTheft: number;
    deductibleAmount: number;
    description: string;
}

export interface VehicleModelMediaResponse {
    id: string;
    mediaType: string;
    fileUrl: string;
    docNo: string;
    entityType: string;
}