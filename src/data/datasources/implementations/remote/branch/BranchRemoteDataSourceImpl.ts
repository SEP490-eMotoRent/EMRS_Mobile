import { AxiosClient } from '../../../../../core/network/AxiosClient';
import { ApiEndpoints } from '../../../../../core/network/APIEndpoint';
import { BranchRemoteDataSource } from '../../../interfaces/remote/branch/BranchRemoteDataSource';
import { BranchResponse } from '../../../../models/branch/BranchResponse';
import { CreateBranchRequest } from '../../../../models/branch/CreateBranchRequest';
import { UpdateBranchRequest } from '../../../../models/branch/UpdateBranchRequest';
import { ApiResponse } from '../../../../../core/network/APIResponse';

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

    async update(id: string, request: UpdateBranchRequest): Promise<BranchResponse> {
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
}