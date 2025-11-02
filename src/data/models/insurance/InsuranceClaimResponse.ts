export interface InsuranceClaimResponse {
    id: string;
    incidentDate: Date | null;
    incidentLocation: string;
    description: string;
    status: string;
    // Vehicle Model
    modelName: string;
    // Vehicle
    licensePlate: string;
    // Insurance Package
    packageName: string;
    packageFee: number;
    coveragePersonLimit: number;
    coveragePropertyLimit: number;
    coverageVehiclePercentage: number;
    coverageTheft: number;
    deductibleAmount: number;
    // Payment Status (nullable - only when Status = Completed)
    vehicleDamageCost: number | null;
    personInjuryCost: number | null;
    thirdPartyCost: number | null;
    totalCost: number | null;
    insuranceCoverageAmount: number | null;
    renterLiabilityAmount: number | null;
    bookingId: string;
    renterId: string;
    createdAt: Date;
}