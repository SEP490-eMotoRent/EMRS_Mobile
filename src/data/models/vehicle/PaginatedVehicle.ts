export interface PaginatedVehicleResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: PaginatedVehicleItem[];
}

export interface PaginatedVehicleItem {
  id: string;
  licensePlate: string;
  color: string;
  yearOfManufacture?: Date;
  currentOdometerKm: number;
  batteryHealthPercentage: number;
  status: string;
  fileUrl?: string[];
  purchaseDate?: Date;
  description: string;
  rentalCount?: number;
  rentalPricing?: RentalPricingResponse;
  vehicleModel?: VehicleModelResponse;
}

interface VehicleModelResponse {
  id: string;
  modelName: string;
  category: string;
  batteryCapacityKwh: number;
  maxRangeKm: number;
  maxSpeedKmh: number;
  description: string;
}

interface RentalPricingResponse {
  id: string;
  rentalPrice: number;
  excessKmPrice: number;
}
