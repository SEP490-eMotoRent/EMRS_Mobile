export interface AvailableColor {
    colorName: string;
}

export interface VehicleModelResponse {
    vehicleModelId: string;
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;
    rentalPrice?: number;
    imageUrl?: string;
    originalRentalPrice?: number;
    availableColors?: AvailableColor[];
}