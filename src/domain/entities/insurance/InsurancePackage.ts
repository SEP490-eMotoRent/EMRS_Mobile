import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

export class InsurancePackage implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public packageName: string;
    public packageFee: number;
    public coveragePersonLimit: number;
    public coveragePropertyLimit: number;
    public coverageVehiclePercentage: number;
    public coverageTheft: number;
    public deductibleAmount: number;
    public description: string;
    public isActive: boolean;

    constructor(
        id: string,
        packageName: string,
        packageFee: number,
        coveragePersonLimit: number,
        coveragePropertyLimit: number,
        coverageVehiclePercentage: number,
        coverageTheft: number,
        deductibleAmount: number,
        description: string,
        isActive: boolean,
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;

        this.packageName = packageName;
        this.packageFee = packageFee;
        this.coveragePersonLimit = coveragePersonLimit;
        this.coveragePropertyLimit = coveragePropertyLimit;
        this.coverageVehiclePercentage = coverageVehiclePercentage;
        this.coverageTheft = coverageTheft;
        this.deductibleAmount = deductibleAmount;
        this.description = description;
        this.isActive = isActive;
    }

    isAvailable(): boolean {
        return this.isActive;
    }

    calculateCoverage(vehicleValue: number): number {
        return vehicleValue * (this.coverageVehiclePercentage / 100);
    }

    delete(): void {
        this.updatedAt = new Date();
        this.deletedAt = new Date();
        this.isDeleted = true;
    }

    restore(): void {
        this.updatedAt = new Date();
        this.deletedAt = null;
        this.isDeleted = false;
    }
}

export type CreateInsurancePackageInput = CreateEntityInput<InsurancePackage>;
export type UpdateInsurancePackageInput = UpdateEntityInput<InsurancePackage>;