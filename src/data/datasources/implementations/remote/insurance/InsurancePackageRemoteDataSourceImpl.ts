import { ApiResponse } from '../../../../../core/network/APIResponse';
import { AxiosClient } from '../../../../../core/network/AxiosClient';
import { InsurancePackageResponse } from '../../../../models/booking/BookingResponse';
import { InsurancePackageRemoteDataSource } from '../../../interfaces/remote/insurance/InsurancePackageRemoteDataSource';

export class InsurancePackageRemoteDataSourceImpl implements InsurancePackageRemoteDataSource {
    private axiosClient: AxiosClient;

    constructor(axiosClient: AxiosClient) {
        this.axiosClient = axiosClient;
    }

    async getAllInsurancePackages(): Promise<InsurancePackageResponse[]> {
        try {
            const response = await this.axiosClient.get<ApiResponse<InsurancePackageResponse[]>>(
                '/InsurancePackage'
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch insurance packages');
            }

            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching insurance packages:', error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Failed to fetch insurance packages'
            );
        }
    }

    async getInsurancePackageById(id: string): Promise<InsurancePackageResponse> {
        try {
            const response = await this.axiosClient.get<ApiResponse<InsurancePackageResponse>>(
                `/InsurancePackage/${id}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch insurance package');
            }

            return response.data.data;
        } catch (error: any) {
            console.error(`Error fetching insurance package ${id}:`, error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Failed to fetch insurance package'
            );
        }
    }
}