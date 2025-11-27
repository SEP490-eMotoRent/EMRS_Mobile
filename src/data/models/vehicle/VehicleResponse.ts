import { RentalPricingResponse } from "../financial/rentalPricing/RentalPricingResponse";
import { VehicleModelResponse } from "../vehicle_model/VehicleModelResponse";

export interface VehicleResponse {
    id: string;
    licensePlate: string;
    color: string;
    yearOfManufacture?: Date;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    fileUrl?: string[];
    purchaseDate?: Date;
    description: string;
    rentalCount?: number;
    rentalPricing?: RentalPricingResponse;
    vehicleModel?: VehicleModelResponse;
}