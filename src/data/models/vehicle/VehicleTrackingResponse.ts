import { RentalPricingResponse } from "../financial/rentalPricing/RentalPricingResponse";

export interface VehicleTrackingResponse {
    id: string;
    licensePlate: string;
    color: string;
    yearOfManufacture?: Date;
    currentOdometerKm: number;
    batteryHealthPercentage: number;
    status: string;
    purchaseDate?: Date;
    description: string;
    rentalPricing?: RentalPricingResponse;
    tempTrackingPayload?: TempTrackingPayload;
}


export interface TempTrackingPayload {
    vehicleId: string;
    imei: string;
    deviceId: number;
    exp: number;
    tmpToken: string;
}
