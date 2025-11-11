import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { InsuranceClaimRemoteDataSource } from "../../../interfaces/remote/insurance/InsuranceClaimRemoteDataSource";
import { CreateInsuranceClaimRequest } from "../../../../models/insurance/insuranceClaim/CreateInsuranceClaimRequest";
import { InsuranceClaimDetailResponse } from "../../../../models/insurance/insuranceClaim/InsuranceClaimDetailResponse";
import { InsuranceClaimResponse } from "../../../../models/insurance/insuranceClaim/InsuranceClaimResponse";
import { ApiResponse, unwrapResponse } from "../../../../../core/network/APIResponse";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";

export class InsuranceClaimRemoteDataSourceImpl implements InsuranceClaimRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async createInsuranceClaim(request: CreateInsuranceClaimRequest): Promise<InsuranceClaimResponse> {
        const formData = new FormData();
        
        formData.append('BookingId', request.bookingId);
        formData.append('IncidentDate', request.incidentDate.toISOString());
        formData.append('IncidentLocation', request.incidentLocation);
        formData.append('Description', request.description);
        
        // Add the actual image files
        if (request.incidentImageFiles && request.incidentImageFiles.length > 0) {
            request.incidentImageFiles.forEach((file) => {
                formData.append('IncidentImageFiles', {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                } as any);
            });
        }

        const response = await this.axiosClient.post<ApiResponse<InsuranceClaimResponse>>(
            ApiEndpoints.insuranceClaim.create,
            formData
        );
        return unwrapResponse(response.data);
    }

    async getMyInsuranceClaims(): Promise<InsuranceClaimResponse[]> {
        const response = await this.axiosClient.get<ApiResponse<InsuranceClaimResponse[]>>(
            ApiEndpoints.insuranceClaim.myClaims
        );
        return unwrapResponse(response.data);
    }

    async getInsuranceClaimDetail(id: string): Promise<InsuranceClaimDetailResponse> {
        const response = await this.axiosClient.get<ApiResponse<InsuranceClaimDetailResponse>>(
            ApiEndpoints.insuranceClaim.detail(id)
        );
        return unwrapResponse(response.data);
    }
}