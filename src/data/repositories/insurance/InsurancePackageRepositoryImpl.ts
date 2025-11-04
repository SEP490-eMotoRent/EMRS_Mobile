import { InsurancePackage } from '../../../domain/entities/insurance/InsurancePackage';
import { InsurancePackageRepository } from '../../../domain/repositories/insurance/InsurancePackageRepository';
import { InsurancePackageRemoteDataSource } from '../../datasources/interfaces/remote/insurance/InsurancePackageRemoteDataSource';
import { InsurancePackageMapper } from '../../mappers/InsurancePackageMapper';

export class InsurancePackageRepositoryImpl implements InsurancePackageRepository {
    private remoteDataSource: InsurancePackageRemoteDataSource;

    constructor(remoteDataSource: InsurancePackageRemoteDataSource) {
        this.remoteDataSource = remoteDataSource;
    }

    async getAllInsurancePackages(activeOnly: boolean = false): Promise<InsurancePackage[]> {
        const dtos = await this.remoteDataSource.getAllInsurancePackages();
        const packages = InsurancePackageMapper.toDomainList(dtos);

        // Frontend filtering for active packages
        if (activeOnly) {
            return packages.filter(pkg => pkg.isAvailable());
        }

        return packages;
    }

    async getInsurancePackageById(id: string): Promise<InsurancePackage> {
        const dto = await this.remoteDataSource.getInsurancePackageById(id);
        return InsurancePackageMapper.toDomain(dto);
    }

    async getActiveInsurancePackages(): Promise<InsurancePackage[]> {
        return this.getAllInsurancePackages(true);
    }
}