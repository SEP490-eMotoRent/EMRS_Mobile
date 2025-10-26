
interface Renter {
    id: string;
    email?: string;
    phone?: string;
    address?: string;
    account?: Account;
}
interface Account {
    id: string;
    username?: string;
    role?: string;
    fullname?: string;
}

interface Vehicle {
    id: string;
    color: string;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    licensePlate: string;
    nextMaintenanceDue?: Date;
    fileUrl?: string[];
    vehicleModel?: VehicleModel;
}
interface VehicleModel {
    id: string;
    modelName?: string;
    category?: string;
    batteryCapacityKwh: number;
    maxRangeKm?: number;
    maxSpeedKmh?: number;
}

export interface BookingResponse {
    id: string;
    startDatetime?: Date;
    endDatetime?: Date;
    baseRentalFee: number;
    depositAmount: number;
    rentalDays: number;
    rentalHours: number;
    rentingRate: number;
    averageRentalPrice: number;
    totalRentalFee: number;
    totalAmount: number;
    bookingStatus: string;
    renter: Renter;
    vehicle: Vehicle;
    insurancePackageId?: string;
    handoverBranchId?: string;
    returnBranchId?: string;
    createdAt?: Date;
}