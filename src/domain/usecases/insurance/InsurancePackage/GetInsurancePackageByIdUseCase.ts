import { InsurancePackage } from "../../../entities/insurance/InsurancePackage";
import { InsurancePackageRepository } from "../../../repositories/insurance/InsurancePackageRepository";

export class GetInsurancePackageByIdUseCase {
    private repository: InsurancePackageRepository;

    constructor(repository: InsurancePackageRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<InsurancePackage> {
        return this.repository.getInsurancePackageById(id);
    }
}