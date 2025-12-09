import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { ConfigurationRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/configuration/ConfigurationRemoteDataSourceImpl';

// Repositories
import { ConfigurationRepositoryImpl } from '../../../data/repositories/configuration/ConfigurationRepositoryImpl';

// Use Cases
import { GetAllConfigurationsUseCase } from '../../../domain/usecases/configuration/GetAllConfigurationsUseCase';
import { GetConfigurationByIdUseCase } from '../../../domain/usecases/configuration/GetConfigurationByIdUseCase';
import { GetConfigurationsByTypeUseCase } from '../../../domain/usecases/configuration/GetConfigurationsByTypeUseCase';

/**
 * ConfigurationModule - Complete Configuration Domain
 * 
 * Handles all system configuration functionality:
 * - Application settings
 * - Feature flags
 * - Business rules
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class ConfigurationModule {
    // ==================== REPOSITORIES ====================
    private _repository: ConfigurationRepositoryImpl | null = null;

    // ==================== USE CASES ====================
    private _getAllConfigurationsUseCase: GetAllConfigurationsUseCase | null = null;
    private _getConfigurationByIdUseCase: GetConfigurationByIdUseCase | null = null;
    private _getConfigurationsByTypeUseCase: GetConfigurationsByTypeUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): ConfigurationModule {
        return new ConfigurationModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get repository(): ConfigurationRepositoryImpl {
        if (!this._repository) {
        const remoteDataSource = new ConfigurationRemoteDataSourceImpl(this.axiosClient);
        this._repository = new ConfigurationRepositoryImpl(remoteDataSource);
        }
        return this._repository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Configuration query use cases
     * Usage: container.configuration.getAll.execute()
     */
    get getAll(): GetAllConfigurationsUseCase {
        if (!this._getAllConfigurationsUseCase) {
        this._getAllConfigurationsUseCase = new GetAllConfigurationsUseCase(this.repository);
        }
        return this._getAllConfigurationsUseCase;
    }

    /**
     * Usage: container.configuration.getById.execute()
     */
    get getById(): GetConfigurationByIdUseCase {
        if (!this._getConfigurationByIdUseCase) {
        this._getConfigurationByIdUseCase = new GetConfigurationByIdUseCase(this.repository);
        }
        return this._getConfigurationByIdUseCase;
    }

    /**
     * Usage: container.configuration.getByType.execute()
     */
    get getByType(): GetConfigurationsByTypeUseCase {
        if (!this._getConfigurationsByTypeUseCase) {
        this._getConfigurationsByTypeUseCase = new GetConfigurationsByTypeUseCase(this.repository);
        }
        return this._getConfigurationsByTypeUseCase;
    }
}