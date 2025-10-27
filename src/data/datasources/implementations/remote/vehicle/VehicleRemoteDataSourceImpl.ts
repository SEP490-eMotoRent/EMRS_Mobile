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

  async getById(id: string): Promise<VehicleResponse | null> {
    try {
      const response = await this.axiosClient.get<ApiResponse<VehicleResponse>>(
        `${ApiEndpoints.vehicle.list}/${id}`
      );
      return unwrapResponse(response.data);
    } catch (error) {
      // If 404, return null instead of throwing
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
        { vehicleModelId }
      );
      return unwrapResponse(response.data);
    } catch (error) {
      return null;
    }
  }

  async getVehicles(
    licensePlate: string,
    color: string,
    currentOdometerKm: number,
    batteryHealthPercentage: number,
    status: string,
    pageSize: number,
    pageNum: number
  ): Promise<PaginatedVehicleResponse> {
    try {
      const response = await this.axiosClient.get<
        ApiResponse<PaginatedVehicleResponse>
      >(ApiEndpoints.vehicle.paginatedList, {
        licensePlate,
        color,
        currentOdometerKm,
        batteryHealthPercentage,
        status,
        pageSize,
        pageNum,
      });
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("Failed to fetch bookings:", error);
      // Return empty paginated response on error
      return {
        currentPage: 1,
        pageSize: pageSize,
        totalItems: 0,
        totalPages: 0,
        items: [],
      };
    }
  }
}
