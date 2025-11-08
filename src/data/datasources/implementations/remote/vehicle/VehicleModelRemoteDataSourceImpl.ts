import { AxiosClient } from '../../../../../core/network/AxiosClient';
import { ApiEndpoints } from '../../../../../core/network/APIEndpoint';
import { ApiResponse, unwrapResponse } from '../../../../../core/network/APIResponse';
import { CreateVehicleModelRequest } from "../../../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelResponse } from "../../../../models/vehicle_model/VehicleModelResponse";
import { VehicleModelRemoteDataSource } from "../../../interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { VehicleModelDetailResponse } from '../../../../models/vehicle_model/VehicleModelDetailResponse';
import { VehicleModelSearchResponse } from '../../../../models/vehicle_model/VehicleModelSearchResponse';

export class VehicleModelRemoteDataSourceImpl implements VehicleModelRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async create(request: CreateVehicleModelRequest): Promise<VehicleModelResponse> {
        const response = await this.axiosClient.post<ApiResponse<VehicleModelResponse>>(
            ApiEndpoints.vehicle.model.create,
            request
        );
        return unwrapResponse(response.data);
    }

    async getAll(): Promise<VehicleModelResponse[]> {
        const response = await this.axiosClient.get<ApiResponse<VehicleModelResponse[]>>(
            ApiEndpoints.vehicle.model.list
        );
        return unwrapResponse(response.data);
    }

    async getDetail(id: string): Promise<VehicleModelDetailResponse | null> {
        try {
            const endpoint = ApiEndpoints.vehicle.model.detail(id);
            const response = await this.axiosClient.get<ApiResponse<VehicleModelDetailResponse>>(endpoint);
            return unwrapResponse(response.data);
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            console.error("Failed to fetch detail:", error);
            return null;
        }
    }

    async search(startTime?: string, endTime?: string, branchId?: string): Promise<VehicleModelSearchResponse[]> {
        try {
            const params: Record<string, string> = {};
            
            if (startTime) params.startTime = startTime;
            if (endTime) params.endTime = endTime;
            if (branchId) params.branchId = branchId;

            const response = await this.axiosClient.get<ApiResponse<VehicleModelSearchResponse[]>>(
                ApiEndpoints.vehicle.model.search,
                { params }
            );
            
            return unwrapResponse(response.data);
        } catch (error: any) {
            console.error("Failed to search vehicles:", error);
            throw error;
        }
    }
}