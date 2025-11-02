export interface InsuranceClaimDetailResponse {
    id: string;
    incidentDate: Date | null;
    incidentLocation: string;
    description: string;
    status: string;
    totalCost: number;
    insuranceCoverageAmount: number;
    renterLiabilityAmount: number;
    bookingId: string;
    renterId: string;
    incidentImages: string[];
    createdAt: Date;
}