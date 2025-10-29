export interface VehicleModelResponse {
    vehicleModelId: string;
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;

    // ---- fields that come from a join ----
    rentalPrice: number;                     // RentalPricing.RentalPrice
    imageUrl?: string;                       // Vehicle.FileUrl / cloudinary
    availableColors?: { colorName: string }[]; // Vehicle.Color or lookup
}