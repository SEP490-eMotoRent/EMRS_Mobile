import { ConfigurationType } from "../../../../../domain/entities/configuration/ConfigurationType";
import { ConfigurationListResponse, ConfigurationResponse } from "../../../../models/configuration/ConfigurationResponseDTO";

export interface ConfigurationRemoteDataSource {
    getAll(): Promise<ConfigurationListResponse>;
    getById(id: string): Promise<ConfigurationResponse>;
    getByType(type: ConfigurationType): Promise<ConfigurationListResponse>;
}