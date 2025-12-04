export interface SummaryResponse {
    baseRentalFee: number;
    totalChargingFee: number;
    totalAdditionalFees: number;
    feesBreakdown: FeesBreakdown;
    totalAmount: number;
    depositAmount: number;
    refundAmount: number;
}


interface FeesBreakdown {
    damageDetails: DamageDetail[];
    cleaningFee: number;
    lateReturnFee: number;
    lateReturnDetails: LateReturnDetails;
    crossBranchFee: number;
    crossBranchDetails: CrossBranchDetails;
    excessKmFee: number;
    excessKmDetails: ExcessKmDetails;
}

interface DamageDetail {
    id: string;
    description: string;
    amount: number;
    createdAt: Date;
}

interface LateReturnDetails {
    endDatetime: Date;
    actualReturnDatetime: Date;
    lateHours: number;
    ratePerHour: number;
}

interface CrossBranchDetails {
    handoverBranchId: string;
    handoverBranchName: string;
    returnBranchId: string;
    returnBranchName: string;
}

interface ExcessKmDetails {
    totalKmLimit: number;
    actualKmDriven: number;
    excessKm: number;
    ratePerKm: number;
    startOdometerKm: number;
    endOdometerKm: number;
}
 