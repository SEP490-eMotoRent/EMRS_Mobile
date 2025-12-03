import { unwrapResponse } from "../../../core/network/APIResponse";
import { Configuration } from "../../../domain/entities/configuration/Configuration";
import { ConfigurationType } from "../../../domain/entities/configuration/ConfigurationType";
import { ConfigurationRepository } from "../../../domain/repositories/configuration/ConfigurationRepository";
import { ConfigurationRemoteDataSource } from "../../datasources/interfaces/remote/configuration/ConfigurationRemoteDataSource";
import { ConfigurationMapper } from "../../mappers/configuration/ConfigurationMapper";

export class ConfigurationRepositoryImpl implements ConfigurationRepository {
    private remoteDataSource: ConfigurationRemoteDataSource;

    constructor(remoteDataSource: ConfigurationRemoteDataSource) {
        this.remoteDataSource = remoteDataSource;
    }

    async getAll(): Promise<Configuration[]> {
        const response = await this.remoteDataSource.getAll();
        const data = unwrapResponse(response);
        return ConfigurationMapper.toDomainList(data);
    }

    async getById(id: string): Promise<Configuration | null> {
        try {
        const response = await this.remoteDataSource.getById(id);
        const data = unwrapResponse(response);
        return ConfigurationMapper.toDomain(data);
        } catch (error) {
        return null;
        }
    }

    async getByType(type: ConfigurationType): Promise<Configuration[]> {
        const response = await this.remoteDataSource.getByType(type);
        const data = unwrapResponse(response);
        return ConfigurationMapper.toDomainList(data);
    }

    async getAdditionalFricingConfig(): Promise<Configuration[]> {
        const response = await this.remoteDataSource.getAdditionalFricingConfig();
        const data = unwrapResponse(response);
        return ConfigurationMapper.toDomainList(data);
    }
}