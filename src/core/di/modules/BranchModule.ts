import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { BranchRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/branch/BranchRemoteDataSourceImpl";
import { ChargingRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/charging/ChargingRemoteDataSourceImpl";

// Repositories
import { ChargingRepositoryImpl } from "../../../data/repositories/charging/ChargingRepositoryImpl";
import { BranchRepositoryImpl } from "../../../data/repositories/operations/BranchRepositoryImpl";
import { ChargingRepository } from "../../../domain/repositories/charging/ChargingRepository";
import { BranchRepository } from "../../../domain/repositories/operations/BranchRepository";

// Use Cases
import { GetAllBranchesUseCase } from "../../../domain/usecases/branch/GetAllBranchesUseCase";
import { GetBranchByIdUseCase } from "../../../domain/usecases/branch/GetBranchByIdUseCase";
import { GetBranchesByVehicleModelUseCase } from "../../../domain/usecases/branch/GetBranchesByVehicleModelUseCase";
import { GetChargingByLicensePlateUseCase } from "../../../domain/usecases/charging/GetChargingByLicensePlateUseCase";
import { SearchChargingStationsUseCase } from "../../../domain/usecases/maps/SearchChargingStationsUseCase";

/**
 * BranchModule - All branch and charging-related functionality
 * 
 * Includes:
 * - Branch management
 * - Charging stations
 */
export class BranchModule {
    // Data Sources
    public readonly remoteDataSource: BranchRemoteDataSourceImpl;
    public readonly chargingRemoteDataSource: ChargingRemoteDataSourceImpl;

    // Repositories
    public readonly repository: BranchRepository;
    public readonly chargingRepository: ChargingRepository;

    // Use Cases - Organized by feature
    public readonly branches = {
        getAll: {} as GetAllBranchesUseCase,
        getById: {} as GetBranchByIdUseCase,
        getByVehicleModel: {} as GetBranchesByVehicleModelUseCase,
    };

    public readonly charging = {
        getByLicensePlate: {} as GetChargingByLicensePlateUseCase,
        searchStations: {} as SearchChargingStationsUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.remoteDataSource = new BranchRemoteDataSourceImpl(axiosClient);
        this.chargingRemoteDataSource = new ChargingRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.repository = new BranchRepositoryImpl(this.remoteDataSource);
        this.chargingRepository = new ChargingRepositoryImpl(this.chargingRemoteDataSource);

        // Initialize branch use cases
        this.branches.getAll = new GetAllBranchesUseCase(this.repository);
        this.branches.getById = new GetBranchByIdUseCase(this.repository);
        this.branches.getByVehicleModel = new GetBranchesByVehicleModelUseCase(this.repository);

        // Initialize charging use cases
        this.charging.getByLicensePlate = new GetChargingByLicensePlateUseCase(this.chargingRepository);
        this.charging.searchStations = new SearchChargingStationsUseCase(this.repository);
    }

    static create(axiosClient: AxiosClient): BranchModule {
        return new BranchModule(axiosClient);
    }
}