export interface CreateVehicleRequest {
    licensePlate: string;
    color: string;
    yearOfManufacture?: string;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    purchaseDate?: string;
    description: string;
    vehicleModelId: string;
    branchId: string;
}