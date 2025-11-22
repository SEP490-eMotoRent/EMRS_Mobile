export interface VehicleDetailResponse {
    id: string;
    licensePlate: string;
    color: string;
    yearOfManufacture?: Date;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    purchaseDate?: Date;
    description: string;
    fileUrl: string[];
    vehicleModel: VehicleModelResponse;
    branch: BranchResponse;
}

interface VehicleModelResponse {
    id: string;
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;
    maxSpeedKmh: number;
    description: string;
    rentalPricing: RentalPricingResponse;
}

interface RentalPricingResponse {
    id: string;
    rentalPrice: number;
    excessKmPrice: number;
}

interface BranchResponse {
    id: string;
    branchName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    openingTime: string;
    closingTime: string;
}