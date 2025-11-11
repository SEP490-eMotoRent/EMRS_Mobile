// export interface AvailableColor {
//     colorName: string;
// }

// export interface VehicleModelDetailResponse {
//     vehicleModelId: string;
//     modelName: string;
//     category: string;
//     batteryCapacityKwh: number;
//     maxRangeKm: number;
//     maxSpeedKmh: number;
//     description: string;
//     rentalPrice: number;
//     imageUrl: string | null;
//     availableColors: AvailableColor[];
// }

export interface RentalPricingInfo {
    id: string;
    rentalPrice: number;
    excessKmPrice: number;
}

export interface VehicleModelDetailResponse {
    vehicleModelId: string;
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;
    maxSpeedKmh: number;
    description: string;
    depositAmount: number;
    rentalPricing: RentalPricingInfo;
    images: string[];
}