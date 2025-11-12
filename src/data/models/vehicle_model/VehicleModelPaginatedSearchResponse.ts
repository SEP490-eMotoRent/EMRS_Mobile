export interface AvailableColor {
    colorName: string;
}

/**
 * Individual vehicle model item in paginated search results
 * Note: This has additional fields compared to VehicleModelSearchResponse
 */
export interface VehicleModelSearchItem {
    vehicleModelId: string;
    modelName: string;
    category: string;
    batteryCapacityKwh: number;
    maxRangeKm: number;
    rentalPrice: number;
    imageUrl: string | null;
    originalRentalPrice: number;
    availableColors: AvailableColor[];
    countTotal: number;
    countAvailable: number;
}

/**
 * Paginated wrapper for vehicle model search results
 * Returned by GET /api/Vehicle/model/search/pagination
 */
export interface VehicleModelPaginatedSearchResponse {
    totalItems: number;    // Total vehicles across all pages
    totalPages: number;    // Total number of pages
    currentPage: number;   // Current page number (1-indexed)
    pageSize: number;      // Items per page
    items: VehicleModelSearchItem[];  // Vehicle models on this page
}