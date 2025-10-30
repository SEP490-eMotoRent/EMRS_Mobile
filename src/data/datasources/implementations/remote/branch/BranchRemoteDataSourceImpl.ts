import { AxiosClient } from '../../../../../core/network/AxiosClient';
import { BranchRemoteDataSource } from '../../../interfaces/remote/branch/BranchRemoteDataSource';
import { BranchResponse } from '../../../../models/branch/BranchResponse';
import { CreateBranchRequest } from '../../../../models/branch/CreateBranchRequest';
import { UpdateBranchRequest } from '../../../../models/branch/UpdateBranchRequest';
import { ApiEndpoints } from '../../../../../core/network/APIEndpoint';

export class BranchRemoteDataSourceImpl implements BranchRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async create(request: CreateBranchRequest): Promise<BranchResponse> {
        const response = await this.axiosClient.post<BranchResponse>(
            ApiEndpoints.branch.create,
            request
        );
        return response.data;
    }

    async getAll(): Promise<BranchResponse[]> {
        const response = await this.axiosClient.get<BranchResponse[]>(
            ApiEndpoints.branch.list
        );
        return response.data;
    }

    async getById(id: string): Promise<BranchResponse> {
        const response = await this.axiosClient.get<BranchResponse>(
            ApiEndpoints.branch.detail(id)
        );
        return response.data;
    }

    async update(id: string, request: UpdateBranchRequest): Promise<BranchResponse> {
        const response = await this.axiosClient.put<BranchResponse>(
            ApiEndpoints.branch.update(id),
            request
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await this.axiosClient.delete(ApiEndpoints.branch.delete(id));
    }
}