import { RentalPricingResponse } from "../financial/rentalPricing/RentalPricingResponse";

export interface VehicleResponse {
    id: string;
    licensePlate: string;
    color: string;
    yearOfManufacture?: Date;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    lastMaintenanceDate?: Date;
    nextMaintenanceDue?: Date;
    fileUrl?: string[];
    purchaseDate?: Date;
    description: string;
    // rentalPricing?: RentalPricingResponse;
    rentalPricing?: number;
}