import { RentalPricingResponse } from "../financial/rentalPricing/RentalPricingResponse";
import { VehicleModelResponse } from "../vehicle_model/VehicleModelResponse";

export interface VehicleResponse {
    id: string;
    licensePlate: string;
    color: string;
    dateManufacturing?: string;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    fileUrl?: string[];
    purchaseDate?: string;
    description: string;
    rentalCount?: number;
    rentalPricing?: RentalPricingResponse;
    vehicleModel?: VehicleModelResponse;
}