export interface CreateInsuranceClaimRequest {
    bookingId: string;
    incidentDate: Date;
    incidentLocation: string;
    description: string;
    incidentImageFiles?: File[];
}