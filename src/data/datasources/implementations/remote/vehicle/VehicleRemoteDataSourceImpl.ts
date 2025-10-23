
import { AxiosClient } from '../../../../../core/network/AxiosClient';
import { ApiEndpoints } from '../../../../../core/network/APIEndpoint';
import { VehicleRemoteDataSource } from '../../../interfaces/remote/vehicle/VehicleRemoteDataSource';
import { CreateVehicleRequest } from '../../../../models/vehicle/CreateVehicleRequest';
import { VehicleResponse } from '../../../../models/vehicle/VehicleResponse';
import { ApiResponse, unwrapResponse } from '../../../../../core/network/APIResponse';

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

    async getWithReferences(vehicleId: string, vehicleModelId: string): Promise<VehicleResponse | null> {
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
}