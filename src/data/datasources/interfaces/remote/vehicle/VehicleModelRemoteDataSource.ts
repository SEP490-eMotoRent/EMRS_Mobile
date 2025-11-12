// VehicleModelRemoteDataSource.ts
import { CreateVehicleModelRequest } from "../../../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelResponse } from "../../../../models/vehicle_model/VehicleModelResponse";
import { VehicleModelDetailResponse } from '../../../../models/vehicle_model/VehicleModelDetailResponse';
import { VehicleModelSearchResponse } from '../../../../models/vehicle_model/VehicleModelSearchResponse';
import { VehicleModelPaginatedSearchResponse } from "../../../../models/vehicle_model/VehicleModelPaginatedSearchResponse";

export interface VehicleModelRemoteDataSource {
    /**
     * Create a new vehicle model
     */
    create(request: CreateVehicleModelRequest): Promise<VehicleModelResponse>;

    /**
     * Get all vehicle models (no pagination)
     */
    getAll(): Promise<VehicleModelResponse[]>;

    /**
     * Get detailed info for a specific vehicle model
     */
    getDetail(id: string): Promise<VehicleModelDetailResponse | null>;

    /**
     * Search vehicles (no pagination) - returns ALL matching results
     * @param startTime - Start time for availability filter
     * @param endTime - End time for availability filter
     * @param branchId - Branch ID for location filter
     */
    search(
        startTime?: string, 
        endTime?: string, 
        branchId?: string
    ): Promise<VehicleModelSearchResponse[]>;

    /**
     * Search vehicles with pagination - for infinite scroll / load more
     * @param pageNum - Page number (1-indexed)
     * @param pageSize - Number of items per page
     * @param startTime - Start time for availability filter
     * @param endTime - End time for availability filter
     * @param branchId - Branch ID for location filter
     */
    searchPaginated(
        pageNum: number,
        pageSize: number,
        startTime?: string,
        endTime?: string,
        branchId?: string
    ): Promise<VehicleModelPaginatedSearchResponse>;
}