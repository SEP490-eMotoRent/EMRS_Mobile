export interface CreateVehicleModelRequest {
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;
    maxSpeedKmh: number;
    description: string;
    rentalPricingId: string;
}