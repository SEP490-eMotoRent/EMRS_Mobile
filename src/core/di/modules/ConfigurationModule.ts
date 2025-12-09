import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { ConfigurationRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/configuration/ConfigurationRemoteDataSourceImpl";

// Repositories
import { ConfigurationRepositoryImpl } from "../../../data/repositories/configuration/ConfigurationRepositoryImpl";

// Use Cases
import { GetAllConfigurationsUseCase } from "../../../domain/usecases/configuration/GetAllConfigurationsUseCase";
import { GetConfigurationByIdUseCase } from "../../../domain/usecases/configuration/GetConfigurationByIdUseCase";
import { GetConfigurationsByTypeUseCase } from "../../../domain/usecases/configuration/GetConfigurationsByTypeUseCase";

/**
 * ConfigurationModule - All system configuration-related functionality
 * 
 * Includes:
 * - System configurations
 * - Configuration retrieval by type
 */
export class ConfigurationModule {
    // Data Sources
    public readonly remoteDataSource: ConfigurationRemoteDataSourceImpl;

    // Repositories
    public readonly repository: ConfigurationRepositoryImpl;

    // Use Cases
    public readonly config = {
        getAll: {} as GetAllConfigurationsUseCase,
        getById: {} as GetConfigurationByIdUseCase,
        getByType: {} as GetConfigurationsByTypeUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.remoteDataSource = new ConfigurationRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.repository = new ConfigurationRepositoryImpl(this.remoteDataSource);

        // Initialize use cases
        this.config.getAll = new GetAllConfigurationsUseCase(this.repository);
        this.config.getById = new GetConfigurationByIdUseCase(this.repository);
        this.config.getByType = new GetConfigurationsByTypeUseCase(this.repository);
    }

    static create(axiosClient: AxiosClient): ConfigurationModule {
        return new ConfigurationModule(axiosClient);
    }
}