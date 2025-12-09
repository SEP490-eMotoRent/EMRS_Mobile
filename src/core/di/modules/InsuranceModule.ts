import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { InsuranceClaimRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/insurance/InsuranceClaimRemoteDataSourceImpl';
import { InsurancePackageRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/insurance/InsurancePackageRemoteDataSourceImpl';

// Repositories
import { InsuranceClaimRepositoryImpl } from '../../../data/repositories/insurance/InsuranceClaimRepositoryImpl';
import { InsurancePackageRepositoryImpl } from '../../../data/repositories/insurance/InsurancePackageRepositoryImpl';

// Use Cases - Claims
import { CreateInsuranceClaimUseCase } from '../../../domain/usecases/insurance/InsuranceClaim/CreateInsuranceClaimUseCase';
import { GetInsuranceClaimDetailUseCase } from '../../../domain/usecases/insurance/InsuranceClaim/GetInsuranceClaimDetailUseCase';
import { GetMyInsuranceClaimsUseCase } from '../../../domain/usecases/insurance/InsuranceClaim/GetMyInsuranceClaimsUseCase';

// Use Cases - Packages
import { GetAllInsurancePackagesUseCase } from '../../../domain/usecases/insurance/InsurancePackage/GetAllInsurancePackagesUseCase';
import { GetInsurancePackageByIdUseCase } from '../../../domain/usecases/insurance/InsurancePackage/GetInsurancePackageByIdUseCase';

/**
 * InsuranceModule - Complete Insurance Domain
 * 
 * Handles all insurance-related functionality:
 * - Insurance claim management
 * - Insurance package browsing
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class InsuranceModule {
    // ==================== REPOSITORIES ====================
    private _claimRepository: InsuranceClaimRepositoryImpl | null = null;
    private _packageRepository: InsurancePackageRepositoryImpl | null = null;

    // ==================== USE CASES - CLAIMS ====================
    private _createClaimUseCase: CreateInsuranceClaimUseCase | null = null;
    private _getMyClaimsUseCase: GetMyInsuranceClaimsUseCase | null = null;
    private _getClaimDetailUseCase: GetInsuranceClaimDetailUseCase | null = null;

    // ==================== USE CASES - PACKAGES ====================
    private _getAllPackagesUseCase: GetAllInsurancePackagesUseCase | null = null;
    private _getPackageByIdUseCase: GetInsurancePackageByIdUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): InsuranceModule {
        return new InsuranceModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get claimRepository(): InsuranceClaimRepositoryImpl {
        if (!this._claimRepository) {
        const remoteDataSource = new InsuranceClaimRemoteDataSourceImpl(this.axiosClient);
        this._claimRepository = new InsuranceClaimRepositoryImpl(remoteDataSource);
        }
        return this._claimRepository;
    }

    get packageRepository(): InsurancePackageRepositoryImpl {
        if (!this._packageRepository) {
        const remoteDataSource = new InsurancePackageRemoteDataSourceImpl(this.axiosClient);
        this._packageRepository = new InsurancePackageRepositoryImpl(remoteDataSource);
        }
        return this._packageRepository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Insurance claim use cases
     * Usage: container.insurance.claims.create.execute()
     */
    get claims() {
        return {
        create: this.createClaimUseCase,
        getMy: this.getMyClaimsUseCase,
        getDetail: this.getClaimDetailUseCase,
        };
    }

    /**
     * Insurance package use cases
     * Usage: container.insurance.packages.getAll.execute()
     */
    get packages() {
        return {
        getAll: this.getAllPackagesUseCase,
        getById: this.getPackageByIdUseCase,
        };
    }

    // ==================== PRIVATE GETTERS - CLAIMS ====================

    private get createClaimUseCase(): CreateInsuranceClaimUseCase {
        if (!this._createClaimUseCase) {
        this._createClaimUseCase = new CreateInsuranceClaimUseCase(this.claimRepository);
        }
        return this._createClaimUseCase;
    }

    private get getMyClaimsUseCase(): GetMyInsuranceClaimsUseCase {
        if (!this._getMyClaimsUseCase) {
        this._getMyClaimsUseCase = new GetMyInsuranceClaimsUseCase(this.claimRepository);
        }
        return this._getMyClaimsUseCase;
    }

    private get getClaimDetailUseCase(): GetInsuranceClaimDetailUseCase {
        if (!this._getClaimDetailUseCase) {
        this._getClaimDetailUseCase = new GetInsuranceClaimDetailUseCase(this.claimRepository);
        }
        return this._getClaimDetailUseCase;
    }

    // ==================== PRIVATE GETTERS - PACKAGES ====================

    private get getAllPackagesUseCase(): GetAllInsurancePackagesUseCase {
        if (!this._getAllPackagesUseCase) {
        this._getAllPackagesUseCase = new GetAllInsurancePackagesUseCase(this.packageRepository);
        }
        return this._getAllPackagesUseCase;
    }

    private get getPackageByIdUseCase(): GetInsurancePackageByIdUseCase {
        if (!this._getPackageByIdUseCase) {
        this._getPackageByIdUseCase = new GetInsurancePackageByIdUseCase(this.packageRepository);
        }
        return this._getPackageByIdUseCase;
    }
}