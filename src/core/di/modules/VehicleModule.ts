import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { VehicleModelRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/vehicle/VehicleModelRemoteDataSourceImpl";
import { VehicleRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/vehicle/VehicleRemoteDataSourceImpl";

// Repositories
import { VehicleModelRepositoryImpl } from "../../../data/repositories/vehicle/VehicleModelRepositoryImpl";
import { VehicleRepositoryImpl } from "../../../data/repositories/vehicle/VehicleRepositoryImpl";
import { VehicleModelRepository } from "../../../domain/repositories/vehicle/VehicleModelRepository";
import { VehicleRepository } from "../../../domain/repositories/vehicle/VehicleRepository";

// Use Cases
import { SearchVehiclesUseCase } from "../../../domain/usecases/vehicle/SearchVehiclesUseCase";

/**
 * VehicleModule - All vehicle-related functionality
 * 
 * Includes:
 * - Vehicle management
 * - Vehicle models
 * - Vehicle search
 */
export class VehicleModule {
    // Data Sources
    public readonly remoteDataSource: VehicleRemoteDataSourceImpl;
    public readonly modelRemoteDataSource: VehicleModelRemoteDataSourceImpl;

    // Repositories
    public readonly repository: VehicleRepository;
    public readonly modelRepository: VehicleModelRepository;

    // Use Cases
    public readonly search = {
        searchVehicles: {} as SearchVehiclesUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.remoteDataSource = new VehicleRemoteDataSourceImpl(axiosClient);
        this.modelRemoteDataSource = new VehicleModelRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.repository = new VehicleRepositoryImpl(this.remoteDataSource);
        this.modelRepository = new VehicleModelRepositoryImpl(this.modelRemoteDataSource);

        // Initialize use cases
        this.search.searchVehicles = new SearchVehiclesUseCase(this.modelRepository);
    }

    static create(axiosClient: AxiosClient): VehicleModule {
        return new VehicleModule(axiosClient);
    }
}