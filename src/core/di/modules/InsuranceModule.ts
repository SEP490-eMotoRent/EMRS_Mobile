import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { InsuranceClaimRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/insurance/InsuranceClaimRemoteDataSourceImpl";
import { InsurancePackageRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/insurance/InsurancePackageRemoteDataSourceImpl";

// Repositories
import { InsuranceClaimRepositoryImpl } from "../../../data/repositories/insurance/InsuranceClaimRepositoryImpl";
import { InsurancePackageRepositoryImpl } from "../../../data/repositories/insurance/InsurancePackageRepositoryImpl";
import { InsuranceClaimRepository } from "../../../domain/repositories/insurance/InsuranceClaimRepository";
import { InsurancePackageRepository } from "../../../domain/repositories/insurance/InsurancePackageRepository";

// Use Cases
import { CreateInsuranceClaimUseCase } from "../../../domain/usecases/insurance/InsuranceClaim/CreateInsuranceClaimUseCase";
import { GetInsuranceClaimDetailUseCase } from "../../../domain/usecases/insurance/InsuranceClaim/GetInsuranceClaimDetailUseCase";
import { GetMyInsuranceClaimsUseCase } from "../../../domain/usecases/insurance/InsuranceClaim/GetMyInsuranceClaimsUseCase";
import { GetAllInsurancePackagesUseCase } from "../../../domain/usecases/insurance/InsurancePackage/GetAllInsurancePackagesUseCase";
import { GetInsurancePackageByIdUseCase } from "../../../domain/usecases/insurance/InsurancePackage/GetInsurancePackageByIdUseCase";

/**
 * InsuranceModule - All insurance-related functionality
 * 
 * Includes:
 * - Insurance claims
 * - Insurance packages
 */
export class InsuranceModule {
    // Data Sources
    public readonly claimRemoteDataSource: InsuranceClaimRemoteDataSourceImpl;
    public readonly packageRemoteDataSource: InsurancePackageRemoteDataSourceImpl;

    // Repositories
    public readonly claimRepository: InsuranceClaimRepository;
    public readonly packageRepository: InsurancePackageRepository;

    // Use Cases - Organized by feature
    public readonly claims = {
        create: {} as CreateInsuranceClaimUseCase,
        getAll: {} as GetMyInsuranceClaimsUseCase,
        getDetail: {} as GetInsuranceClaimDetailUseCase,
    };

    public readonly packages = {
        getAll: {} as GetAllInsurancePackagesUseCase,
        getById: {} as GetInsurancePackageByIdUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.claimRemoteDataSource = new InsuranceClaimRemoteDataSourceImpl(axiosClient);
        this.packageRemoteDataSource = new InsurancePackageRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.claimRepository = new InsuranceClaimRepositoryImpl(this.claimRemoteDataSource);
        this.packageRepository = new InsurancePackageRepositoryImpl(this.packageRemoteDataSource);

        // Initialize claims use cases
        this.claims.create = new CreateInsuranceClaimUseCase(this.claimRepository);
        this.claims.getAll = new GetMyInsuranceClaimsUseCase(this.claimRepository);
        this.claims.getDetail = new GetInsuranceClaimDetailUseCase(this.claimRepository);

        // Initialize packages use cases
        this.packages.getAll = new GetAllInsurancePackagesUseCase(this.packageRepository);
        this.packages.getById = new GetInsurancePackageByIdUseCase(this.packageRepository);
    }

    static create(axiosClient: AxiosClient): InsuranceModule {
        return new InsuranceModule(axiosClient);
    }
}