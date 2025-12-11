import { AdditionalFeeResponse } from "../AdditionalFeeResponse";

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
    rentalContract: RentalContractBookingResponse; // ✅ Nested
    rentalReceipt: RentalReceiptBookingResponse[]; // ✅ Nested
    insurancePackage: InsurancePackageBookingResponse; // ✅ Nested
    handoverBranch: BranchBookingResponse; // ✅ Nested

    additionalFees?: AdditionalFeeResponse[];
    earlyHandoverFee?: number;
    excessKmFee?: number;
    cleaningFee?: number;
    crossBranchFee?: number;
    totalChargingFee?: number;
    totalAdditionalFee?: number;
    refundAmount?: number;
}

export interface RenterBookingResponse {
    id: string;
    email?: string;
    phone?: string; // ✅ Note: backend has lowercase 'phone'
    address?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
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
    fileUrl?: string[];
    rentalPricing?: RentalPricingBookingResponse; // ✅ This is the rental price, not ID
    vehicleModel?: VehicleModelBookingResponse; // ✅ Nested
}

export interface RentalPricingBookingResponse {
    id: string;
    rentalPrice: number;
    excessKmPrice: number;
}

export interface VehicleModelBookingResponse {
    id: string;
    modelName?: string;
    category?: string;
    batteryCapacityKwh?: number;
    maxRangeKm?: number;
    maxSpeedKmh?: number;
}

export interface RentalContractBookingResponse {
    id: string;
    contractNumber: string;
    contractTerms: string;
    otpCode: string;
    contractStatus: string;
    file: string;
}

export interface RentalReceiptBookingResponse {
    id: string;
    notes: string;
    renterConfirmedAt: string | null;
    startOdometerKm: number;
    endOdometerKm: number;
    startBatteryPercentage: number;
    endBatteryPercentage: number;
    bookingId: string;
    staffId: string;
    handOverVehicleImageFiles: string[];
    returnVehicleImageFiles: string[];
    checkListHandoverFile: string[];
    checkListReturnFile: string[];
}

export interface InsurancePackageBookingResponse {
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

export interface BranchBookingResponse {
    id: string;
    branchName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    openingTime: string;
    closingTime: string;
}