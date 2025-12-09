import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { VehicleModelRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/vehicle/VehicleModelRemoteDataSourceImpl';
import { VehicleRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/vehicle/VehicleRemoteDataSourceImpl';

// Repositories
import { VehicleModelRepositoryImpl } from '../../../data/repositories/vehicle/VehicleModelRepositoryImpl';
import { VehicleRepositoryImpl } from '../../../data/repositories/vehicle/VehicleRepositoryImpl';

// Use Cases
import { SearchVehiclesUseCase } from '../../../domain/usecases/vehicle/SearchVehiclesUseCase';

/**
 * VehicleModule - Complete Vehicle Domain
 * 
 * Handles all vehicle-related functionality:
 * - Vehicle management
 * - Vehicle model management
 * - Vehicle search
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class VehicleModule {
    // ==================== REPOSITORIES ====================
    private _vehicleRepository: VehicleRepositoryImpl | null = null;
    private _vehicleModelRepository: VehicleModelRepositoryImpl | null = null;

    // ==================== USE CASES ====================
    private _searchVehiclesUseCase: SearchVehiclesUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): VehicleModule {
        return new VehicleModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get repository(): VehicleRepositoryImpl {
        if (!this._vehicleRepository) {
        const remoteDataSource = new VehicleRemoteDataSourceImpl(this.axiosClient);
        this._vehicleRepository = new VehicleRepositoryImpl(remoteDataSource);
        }
        return this._vehicleRepository;
    }

    get modelRepository(): VehicleModelRepositoryImpl {
        if (!this._vehicleModelRepository) {
        const remoteDataSource = new VehicleModelRemoteDataSourceImpl(this.axiosClient);
        this._vehicleModelRepository = new VehicleModelRepositoryImpl(remoteDataSource);
        }
        return this._vehicleModelRepository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Vehicle search use case
     * Usage: container.vehicle.search.execute()
     */
    get search(): SearchVehiclesUseCase {
        return this.searchVehiclesUseCase;
    }

    // ==================== PRIVATE GETTERS ====================

    private get searchVehiclesUseCase(): SearchVehiclesUseCase {
        if (!this._searchVehiclesUseCase) {
        this._searchVehiclesUseCase = new SearchVehiclesUseCase(this.modelRepository);
        }
        return this._searchVehiclesUseCase;
    }
}