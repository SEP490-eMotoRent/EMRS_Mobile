export interface ReactNativeFile {
    uri: string;
    type: string;
    name: string;
}

export interface CreateInsuranceClaimRequest {
    bookingId: string;
    incidentDate: Date;
    incidentLocation: string;
    description: string;
    incidentImageFiles?: ReactNativeFile[];
}