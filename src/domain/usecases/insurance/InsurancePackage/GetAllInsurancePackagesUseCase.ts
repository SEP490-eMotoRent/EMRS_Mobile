import { InsurancePackage } from "../../../entities/insurance/InsurancePackage";
import { InsurancePackageRepository } from "../../../repositories/insurance/InsurancePackageRepository";

export interface GetAllInsurancePackagesParams {
    activeOnly?: boolean;
}

export class GetAllInsurancePackagesUseCase {
    private repository: InsurancePackageRepository;

    constructor(repository: InsurancePackageRepository) {
        this.repository = repository;
    }

    async execute(params?: GetAllInsurancePackagesParams): Promise<InsurancePackage[]> {
        const activeOnly = params?.activeOnly ?? true; // Default to active only
        return this.repository.getAllInsurancePackages(activeOnly);
    }
}