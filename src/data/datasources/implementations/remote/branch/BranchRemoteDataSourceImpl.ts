import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { BranchResponse } from "../../../../models/branch/BranchResponse";
import { CreateBranchRequest } from "../../../../models/branch/CreateBranchRequest";
import { UpdateBranchRequest } from "../../../../models/branch/UpdateBranchRequest";
import { BranchRemoteDataSource } from "../../../interfaces/remote/branch/BranchRemoteDataSource";

export class BranchRemoteDataSourceImpl implements BranchRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async create(request: CreateBranchRequest): Promise<BranchResponse> {
    const response = await this.axiosClient.post<ApiResponse<BranchResponse>>(
      ApiEndpoints.branch.create,
      request
    );
    return response.data.data;
  }

  async getAll(): Promise<BranchResponse[]> {
    const response = await this.axiosClient.get<ApiResponse<BranchResponse[]>>(
      ApiEndpoints.branch.list
    );
    return response.data.data;
  }

  async getById(id: string): Promise<BranchResponse> {
    const response = await this.axiosClient.get<ApiResponse<BranchResponse>>(
      ApiEndpoints.branch.detail(id)
    );
    return response.data.data;
  }

  async getByVehicleModelId(vehicleModelId: string): Promise<BranchResponse[]> {
    const response = await this.axiosClient.get<ApiResponse<BranchResponse[]>>(
      ApiEndpoints.branch.byVehicleModel(vehicleModelId)
    );
    return response.data.data;
  }

  async update(
    id: string,
    request: UpdateBranchRequest
  ): Promise<BranchResponse> {
    const response = await this.axiosClient.put<ApiResponse<BranchResponse>>(
      ApiEndpoints.branch.update(id),
      request
    );
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await this.axiosClient.delete<ApiResponse<void>>(
      ApiEndpoints.branch.delete(id)
    );
  }

  async getByLocation(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<ApiResponse<BranchResponse[]>> {
    const response = await this.axiosClient.get<ApiResponse<BranchResponse[]>>(
      ApiEndpoints.branch.getByLocation(latitude, longitude, radius)
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  }
}
