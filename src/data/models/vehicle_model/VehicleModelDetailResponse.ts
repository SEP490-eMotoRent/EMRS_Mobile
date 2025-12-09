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
    id?: string;           // present in some responses, not in detail → sometimes missing
    rentalPrice: number;   // always present
    excessKmPrice?: number; // NOT returned in detail endpoint → must be optional
}

export interface VehicleModelDetailResponse {
    id: string;
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;
    maxSpeedKmh: number;
    description: string;
    depositAmount: number;
    rentalPricing: RentalPricingInfo; // partial object is allowed now
    images: string[]; // can be empty array []
}