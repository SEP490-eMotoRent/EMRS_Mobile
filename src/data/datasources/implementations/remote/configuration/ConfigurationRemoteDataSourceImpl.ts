import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { ConfigurationType } from "../../../../../domain/entities/configuration/ConfigurationType";
import { ConfigurationListResponse, ConfigurationResponse } from "../../../../models/configuration/ConfigurationResponseDTO";
import { ConfigurationRemoteDataSource } from "../../../interfaces/remote/configuration/ConfigurationRemoteDataSource";

export class ConfigurationRemoteDataSourceImpl implements ConfigurationRemoteDataSource {
    private axiosClient: AxiosClient;
    private readonly baseEndpoint = "/Configuration";

    constructor(axiosClient: AxiosClient) {
        this.axiosClient = axiosClient;
    }

    async getAll(): Promise<ConfigurationListResponse> {
        const response = await this.axiosClient.get<ConfigurationListResponse>(this.baseEndpoint);
        return response.data;
    }

    async getById(id: string): Promise<ConfigurationResponse> {
        const response = await this.axiosClient.get<ConfigurationResponse>(`${this.baseEndpoint}/${id}`);
        return response.data;
    }

    async getByType(type: ConfigurationType): Promise<ConfigurationListResponse> {
        const response = await this.axiosClient.get<ConfigurationListResponse>(`${this.baseEndpoint}/type/${type}`);
        return response.data;
    }
}