import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { CreateInsuranceClaimRequest } from "../../../../models/insurance/insuranceClaim/CreateInsuranceClaimRequest";
import { InsuranceClaimDetailResponse } from "../../../../models/insurance/insuranceClaim/InsuranceClaimDetailResponse";
import { InsuranceClaimResponse } from "../../../../models/insurance/insuranceClaim/InsuranceClaimResponse";
import { InsuranceClaimRemoteDataSource } from "../../../interfaces/remote/insurance/InsuranceClaimRemoteDataSource";

export class InsuranceClaimRemoteDataSourceImpl implements InsuranceClaimRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async createInsuranceClaim(request: CreateInsuranceClaimRequest): Promise<InsuranceClaimResponse> {
        const formData = new FormData();
        formData.append('BookingId', request.bookingId);
        formData.append('IncidentDate', request.incidentDate.toISOString());
        formData.append('IncidentLocation', request.incidentLocation);
        formData.append('Description', request.description);

        // Append images if any
        if (request.incidentImageFiles && request.incidentImageFiles.length > 0) {
            request.incidentImageFiles.forEach((file, index) => {
                formData.append('IncidentImageFiles', file);
            });
        }

        const response = await this.axiosClient.post<{ data: any }>(
            ApiEndpoints.insuranceClaim.create,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return this.mapToInsuranceClaim(response.data.data);
    }

    async getMyInsuranceClaims(): Promise<InsuranceClaimResponse[]> {
        const response = await this.axiosClient.get<{ data: any[] }>(
            ApiEndpoints.insuranceClaim.myClaims
        );

        return response.data.data.map(this.mapToInsuranceClaim);
    }

    async getInsuranceClaimDetail(id: string): Promise<InsuranceClaimDetailResponse> {
        const response = await this.axiosClient.get<{ data: any }>(
            ApiEndpoints.insuranceClaim.detail(id)
        );

        return this.mapToInsuranceClaimDetail(response.data.data);
    }

    private mapToInsuranceClaim(data: any): InsuranceClaimResponse {
        return {
            id: data.id,
            incidentDate: data.incidentDate ? new Date(data.incidentDate) : null,
            incidentLocation: data.incidentLocation,
            description: data.description,
            status: data.status,
            modelName: data.modelName,
            licensePlate: data.licensePlate,
            packageName: data.packageName,
            packageFee: data.packageFee,
            coveragePersonLimit: data.coveragePersonLimit,
            coveragePropertyLimit: data.coveragePropertyLimit,
            coverageVehiclePercentage: data.coverageVehiclePercentage,
            coverageTheft: data.coverageTheft,
            deductibleAmount: data.deductibleAmount,
            vehicleDamageCost: data.vehicleDamageCost,
            personInjuryCost: data.personInjuryCost,
            thirdPartyCost: data.thirdPartyCost,
            totalCost: data.totalCost,
            insuranceCoverageAmount: data.insuranceCoverageAmount,
            renterLiabilityAmount: data.renterLiabilityAmount,
            bookingId: data.bookingId,
            renterId: data.renterId,
            createdAt: new Date(data.createdAt),
        };
    }

    private mapToInsuranceClaimDetail(data: any): InsuranceClaimDetailResponse {
        return {
            id: data.id,
            incidentDate: data.incidentDate ? new Date(data.incidentDate) : null,
            incidentLocation: data.incidentLocation,
            description: data.description,
            status: data.status,
            totalCost: data.totalCost,
            insuranceCoverageAmount: data.insuranceCoverageAmount,
            renterLiabilityAmount: data.renterLiabilityAmount,
            bookingId: data.bookingId,
            renterId: data.renterId,
            incidentImages: data.incidentImages || [],
            createdAt: new Date(data.createdAt),
        };
    }
}