export interface InsurancePackageResponse {
    id: string;
    packageName: string;
    packageFee: number;
    coveragePersonLimit: number;
    coveragePropertyLimit: number;
    coverageVehiclePercentage: number;
    coverageTheft: number;
    deductibleAmount: number;
    description: string;
}