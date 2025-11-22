import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import {
  ApiResponse,
  unwrapResponse,
} from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { CreateVehicleRequest } from "../../../../models/vehicle/CreateVehicleRequest";
import { PaginatedVehicleResponse } from "../../../../models/vehicle/PaginatedVehicle";
import { VehicleResponse } from "../../../../models/vehicle/VehicleResponse";
import { VehicleRemoteDataSource } from "../../../interfaces/remote/vehicle/VehicleRemoteDataSource";
import { VehicleTrackingResponse } from "../../../../models/vehicle/VehicleTrackingResponse";
import { VehicleDetailResponse } from "../../../../models/vehicle/VehicleDetailResponse";

export class VehicleRemoteDataSourceImpl implements VehicleRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async create(request: CreateVehicleRequest): Promise<VehicleResponse> {
    const response = await this.axiosClient.post<ApiResponse<VehicleResponse>>(
      ApiEndpoints.vehicle.create,
      request
    );
    return unwrapResponse(response.data);
  }

  async getAll(): Promise<VehicleResponse[]> {
    const response = await this.axiosClient.get<ApiResponse<VehicleResponse[]>>(
      ApiEndpoints.vehicle.list
    );
    return unwrapResponse(response.data);
  }

  async getById(id: string): Promise<VehicleDetailResponse | null> {
    try {
      const response = await this.axiosClient.get<ApiResponse<VehicleDetailResponse>>(
        ApiEndpoints.vehicle.detail(id)
      );
      return unwrapResponse(response.data);
    } catch {
      return null;
    }
  }

  async getWithReferences(
    vehicleId: string,
    vehicleModelId: string
  ): Promise<VehicleResponse | null> {
    try {
      const response = await this.axiosClient.get<ApiResponse<VehicleResponse>>(
        `${ApiEndpoints.vehicle.list}/${vehicleId}`,
        { params: { vehicleModelId } } // ← fixed
      );
      return unwrapResponse(response.data);
    } catch {
      return null;
    }
  }

  async getVehicles(
    licensePlate: string,
    color: string,
    currentOdometerKm: number,
    batteryHealthPercentage: number,
    status: string,
    branchId: string,
    vehicleModelId: string,
    pageSize: number,
    pageNum: number
  ): Promise<PaginatedVehicleResponse> {
    try {
      const response = await this.axiosClient.get<
        ApiResponse<PaginatedVehicleResponse>
      >(ApiEndpoints.vehicle.paginatedList, {
        params: {
          licensePlate,
          color,
          currentOdometerKm,
          batteryHealthPercentage,
          status,
          branchId,
          vehicleModelId,
          pageSize,
          pageNum,
        },
      });
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("Failed to fetch vehicles:", error);
      return {
        currentPage: 1,
        pageSize,
        totalItems: 0,
        totalPages: 0,
        items: [],
      };
    }
  }

  async getTracking(vehicleId: string): Promise<VehicleTrackingResponse> {
    const response = await this.axiosClient.get<
      ApiResponse<VehicleTrackingResponse>
    >(ApiEndpoints.vehicle.tracking(vehicleId));
    return unwrapResponse(response.data);
  }
}
