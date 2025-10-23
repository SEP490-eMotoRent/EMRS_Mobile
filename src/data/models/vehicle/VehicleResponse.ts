import { RentalPricingResponse } from "../financial/rentalPricing/RentalPricingResponse";

export interface VehicleResponse {
    id: string;
    licensePlate: string;
    color: string;
    yearOfManufacture?: string;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    lastMaintenanceDate?: string;
    nextMaintenanceDue?: string;
    purchaseDate?: string;
    description: string;
    rentalPricing?: RentalPricingResponse;
}