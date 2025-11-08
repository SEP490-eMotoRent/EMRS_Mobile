export interface AvailableColor {
    colorName: string;
}

export interface VehicleModelSearchResponse {
    vehicleModelId: string;
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;
    rentalPrice: number;
    imageUrl: string | null;
    availableColors: AvailableColor[];
}