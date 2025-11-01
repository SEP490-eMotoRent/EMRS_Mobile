import { ServerException } from "../../../../../core/errors/ServerException";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { AppLogger } from "../../../../../core/utils/Logger";
import { UpdateRenterRequest } from "../../../../models/account/renter/UpdateRenterRequest";
import { RegisterRenterResponse } from "../../../../models/account/renter/RegisterRenterResponse";
import { RenterResponse } from "../../../../models/account/renter/RenterResponse";
import { RenterRemoteDataSource } from "../../../interfaces/remote/account/RenterRemoteDataSource";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse, unwrapResponse } from "../../../../../core/network/APIResponse";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
    Id: string;          // Account ID
    UserId: string;      // Renter ID ✅
    Username: string;
    role: string;
    exp: number;
}
import { ScanFaceResponse } from "../../../../models/account/renter/ScanFaceResponse";
import { ScanFaceRequest } from "../../../../models/account/renter/ScanFaceRequest";

export class RenterRemoteDataSourceImpl implements RenterRemoteDataSource {
    private readonly apiClient: AxiosClient;
    private readonly logger = AppLogger.getInstance();

    constructor(apiClient: AxiosClient) {
        this.apiClient = apiClient;
    }

    /**
     * Extract renter ID from JWT token
     */
    private getRenterIdFromToken(): string {
        try {
            // Get token from axios client headers or storage
            const token = this.apiClient.getAuthToken(); // You'll need to implement this
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const decoded = jwtDecode<JWTPayload>(token);
            
            if (!decoded.UserId) {
                throw new Error('UserId not found in token');
            }

            this.logger.info(`Extracted Renter ID from token: ${decoded.UserId}`);
            return decoded.UserId;
        } catch (error: any) {
            this.logger.error(`Failed to extract renter ID from token: ${error.message}`);
            throw new ServerException('Invalid authentication token', 401);
        }
    }

    async create(): Promise<RegisterRenterResponse> {
        try {
            this.logger.info('Creating renter via API...');
            const response = await this.apiClient.post<ApiResponse<RegisterRenterResponse>>('/renters', {});
            this.logger.info('Renter created successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to create renter: ${error.message}`);
            throw new ServerException(error.response?.data?.message || 'Failed to create renter', error.response?.status || 500);
        }
    }

    async getAll(): Promise<RegisterRenterResponse[]> {
        try {
            this.logger.info('Fetching all renters...');
            const response = await this.apiClient.get<ApiResponse<RegisterRenterResponse[]>>('/renters');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to get renters: ${error.message}`);
            throw new ServerException(error.response?.data?.message || 'Failed to fetch renters', error.response?.status || 500);
        }
    }

    async getById(id: string): Promise<RenterResponse> {
        try {
            this.logger.info(`Fetching renter by ID: ${id}`);
            const response = await this.apiClient.get<ApiResponse<RenterResponse>>(
                ApiEndpoints.renter.detail(id)
            );
            return unwrapResponse(response.data);
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            this.logger.error(`Failed to get renter ${id}: ${error.message}`);
            throw new ServerException(error.response?.data?.message || 'Failed to fetch renter', error.response?.status || 500);
        }
    }

    async getCurrent(): Promise<RenterResponse> {
        try {
            this.logger.info('Fetching current renter profile...');
            
            // Extract renter ID from JWT token
            const renterId = this.getRenterIdFromToken();
            
            // Use the detail endpoint with the extracted ID
            const response = await this.apiClient.get<ApiResponse<RenterResponse>>(
                ApiEndpoints.renter.detail(renterId)
            );
            
            this.logger.info('Current renter profile fetched successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to get current renter: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to fetch renter profile', 
                error.response?.status || 500
            );
        }
    }

    async update(request: UpdateRenterRequest): Promise<RegisterRenterResponse> {
        try {
            this.logger.info('Updating renter profile...');

            if (request.profilePicture) {
                const formData = new FormData();
                formData.append('email', request.email);
                formData.append('phone', request.phone);
                formData.append('address', request.address);
                formData.append('dateOfBirth', request.dateOfBirth);
                formData.append('mediaId', request.mediaId);
                formData.append('fullname', request.fullname);
                formData.append('profilePicture', request.profilePicture);

                const response = await this.apiClient.put<ApiResponse<RegisterRenterResponse>>(
                    ApiEndpoints.renter.update,
                    formData
                );

                this.logger.info('Renter profile updated with image');
                return unwrapResponse(response.data);
            } else {
                const response = await this.apiClient.put<ApiResponse<RegisterRenterResponse>>(
                    ApiEndpoints.renter.update,
                    {
                        email: request.email,
                        phone: request.phone,
                        address: request.address,
                        dateOfBirth: request.dateOfBirth,
                        mediaId: request.mediaId,
                        fullname: request.fullname,
                    }
                );

                this.logger.info('Renter profile updated');
                return unwrapResponse(response.data);
            }
        } catch (error: any) {
            this.logger.error(`Failed to update renter: ${error.message}`);
            throw new ServerException(error.response?.data?.message || 'Failed to update profile', error.response?.status || 500);
        }
    }

    async scanFace(request: ScanFaceRequest): Promise<ApiResponse<ScanFaceResponse>> {
        try {
        this.logger.info('Scanning face...');
        const formData = new FormData();
        formData.append('image', {
            uri: request.image,
            name: `face_${Date.now()}.jpg`,
            type: "image/jpeg",
        } as any);
        const response = await this.apiClient.post<ApiResponse<ScanFaceResponse>>(ApiEndpoints.renter.scanFace, formData);
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data,
            code: response.data.code,
        };
        } catch (error: any) {
        this.logger.error(`Failed to scan face: ${error.message}`);
        throw new ServerException(error.response?.data?.message || 'Failed to scan face', error.response?.status || 500);
        }
    }
}