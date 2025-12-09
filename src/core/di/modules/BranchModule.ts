import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { BranchRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/branch/BranchRemoteDataSourceImpl';
import { ChargingRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/charging/ChargingRemoteDataSourceImpl';

// Repositories
import { BranchRepositoryImpl } from '../../../data/repositories/operations/BranchRepositoryImpl';
import { ChargingRepositoryImpl } from '../../../data/repositories/charging/ChargingRepositoryImpl';

// Use Cases - Branch
import { GetAllBranchesUseCase } from '../../../domain/usecases/branch/GetAllBranchesUseCase';
import { GetBranchByIdUseCase } from '../../../domain/usecases/branch/GetBranchByIdUseCase';
import { GetBranchesByVehicleModelUseCase } from '../../../domain/usecases/branch/GetBranchesByVehicleModelUseCase';
import { SearchChargingStationsUseCase } from '../../../domain/usecases/maps/SearchChargingStationsUseCase';

// Use Cases - Charging
import { GetChargingByLicensePlateUseCase } from '../../../domain/usecases/charging/GetChargingByLicensePlateUseCase';

/**
 * BranchModule - Complete Branch and Charging Domain
 * 
 * Handles all branch and charging station functionality:
 * - Branch management
 * - Charging station search
 * - Vehicle availability by branch
 * - Charging session tracking
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class BranchModule {
    // ==================== REPOSITORIES ====================
    private _branchRepository: BranchRepositoryImpl | null = null;
    private _chargingRepository: ChargingRepositoryImpl | null = null;

    // ==================== USE CASES - BRANCH ====================
    private _getAllBranchesUseCase: GetAllBranchesUseCase | null = null;
    private _getBranchByIdUseCase: GetBranchByIdUseCase | null = null;
    private _getBranchesByVehicleModelUseCase: GetBranchesByVehicleModelUseCase | null = null;
    private _searchChargingStationsUseCase: SearchChargingStationsUseCase | null = null;

    // ==================== USE CASES - CHARGING ====================
    private _getChargingByLicensePlateUseCase: GetChargingByLicensePlateUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): BranchModule {
        return new BranchModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get repository(): BranchRepositoryImpl {
        if (!this._branchRepository) {
        const remoteDataSource = new BranchRemoteDataSourceImpl(this.axiosClient);
        this._branchRepository = new BranchRepositoryImpl(remoteDataSource);
        }
        return this._branchRepository;
    }

    get chargingRepository(): ChargingRepositoryImpl {
        if (!this._chargingRepository) {
        const remoteDataSource = new ChargingRemoteDataSourceImpl(this.axiosClient);
        this._chargingRepository = new ChargingRepositoryImpl(remoteDataSource);
        }
        return this._chargingRepository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Branch query use cases
     * Usage: container.branch.get.all.execute()
     */
    get get() {
        return {
        all: this.getAllBranchesUseCase,
        byId: this.getBranchByIdUseCase,
        byVehicleModel: this.getBranchesByVehicleModelUseCase,
        };
    }

    /**
     * Charging station use cases
     * Usage: container.branch.charging.search.execute()
     */
    get charging() {
        return {
        search: this.searchChargingStationsUseCase,
        getByLicensePlate: this.getChargingByLicensePlateUseCase,
        };
    }

    // ==================== PRIVATE GETTERS - BRANCH ====================

    private get getAllBranchesUseCase(): GetAllBranchesUseCase {
        if (!this._getAllBranchesUseCase) {
        this._getAllBranchesUseCase = new GetAllBranchesUseCase(this.repository);
        }
        return this._getAllBranchesUseCase;
    }

    private get getBranchByIdUseCase(): GetBranchByIdUseCase {
        if (!this._getBranchByIdUseCase) {
        this._getBranchByIdUseCase = new GetBranchByIdUseCase(this.repository);
        }
        return this._getBranchByIdUseCase;
    }

    private get getBranchesByVehicleModelUseCase(): GetBranchesByVehicleModelUseCase {
        if (!this._getBranchesByVehicleModelUseCase) {
        this._getBranchesByVehicleModelUseCase = new GetBranchesByVehicleModelUseCase(this.repository);
        }
        return this._getBranchesByVehicleModelUseCase;
    }

    private get searchChargingStationsUseCase(): SearchChargingStationsUseCase {
        if (!this._searchChargingStationsUseCase) {
        this._searchChargingStationsUseCase = new SearchChargingStationsUseCase(this.repository);
        }
        return this._searchChargingStationsUseCase;
    }

    // ==================== PRIVATE GETTERS - CHARGING ====================

    private get getChargingByLicensePlateUseCase(): GetChargingByLicensePlateUseCase {
        if (!this._getChargingByLicensePlateUseCase) {
        this._getChargingByLicensePlateUseCase = new GetChargingByLicensePlateUseCase(this.chargingRepository);
        }
        return this._getChargingByLicensePlateUseCase;
    }
}