import { ServerException } from "../../../../../core/errors/ServerException";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { AppLogger } from "../../../../../core/utils/Logger";

import { jwtDecode } from "jwt-decode";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse, unwrapResponse } from "../../../../../core/network/APIResponse";
import { RegisterRenterResponse } from "../../../../models/account/renter/RegisterRenterResponse";
import { RenterResponse } from "../../../../models/account/renter/RenterResponse";
import { ScanFaceRequest } from "../../../../models/account/renter/ScanFaceRequest";
import { ScanFaceResponse } from "../../../../models/account/renter/ScanFaceResponse";
import { UpdateRenterResponse } from "../../../../models/account/renter/update/RenterAccountUpdateResponse";
import { UpdateRenterRequest } from "../../../../models/account/renter/update/UpdateRenterRequest";
import { RenterRemoteDataSource } from "../../../interfaces/remote/account/RenterRemoteDataSource";

interface JWTPayload {
    Id: string;
    UserId: string;
    Username: string;
    role: string;
    exp: number;
}

export class RenterRemoteDataSourceImpl implements RenterRemoteDataSource {
    private readonly apiClient: AxiosClient;
    private readonly logger = AppLogger.getInstance();

    constructor(apiClient: AxiosClient) {
        this.apiClient = apiClient;
    }

    private getRenterIdFromToken(): string {
        try {
            const token = this.apiClient.getAuthToken();
            
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
            
            const renterId = this.getRenterIdFromToken();
            
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

    async update(request: UpdateRenterRequest): Promise<UpdateRenterResponse> {
        try {
            this.logger.info('Updating renter profile...');

            console.log('=== DATASOURCE RECEIVED ===');
            console.log('Email:', request.Email);
            console.log('phone:', request.phone);
            console.log('Address:', request.Address);
            console.log('DateOfBirth:', request.DateOfBirth);
            console.log('Fullname:', request.Fullname);
            console.log('MediaId:', request.MediaId);
            console.log('ProfilePicture:', !!request.ProfilePicture);
            console.log('===========================');

            const formData = new FormData();

            // Required
            formData.append('Email', request.Email);
            formData.append('phone', request.phone);
            formData.append('Address', request.Address);

            // Optional
            if (request.DateOfBirth) formData.append('DateOfBirth', request.DateOfBirth);
            if (request.Fullname) formData.append('Fullname', request.Fullname);
            if (request.MediaId) formData.append('MediaId', request.MediaId);

            // File (only if new image)
            if (request.ProfilePicture) {
                formData.append('ProfilePicture', {
                    uri: request.ProfilePicture.uri,
                    name: request.ProfilePicture.name || 'profile.jpg',
                    type: request.ProfilePicture.type || 'image/jpeg',
                } as any);
            }

            console.log('=== SENDING FORMDATA ===');

            // CRITICAL: NO HEADERS! Let Axios set Content-Type + boundary
            const response = await this.apiClient.put<ApiResponse<UpdateRenterResponse>>(
                ApiEndpoints.renter.update,
                formData
                // NO { headers: ... }
            );

            this.logger.info('Renter profile updated successfully');
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to update renter: ${error.message}`);

            if (error.response) {
                console.log('=== ERROR RESPONSE ===');
                console.log('Status:', error.response.status);
                console.log('Data:', JSON.stringify(error.response.data, null, 2));
            } else if (error.request) {
                console.log('=== NO RESPONSE (Network Error) ===');
                console.log(error.request);
            } else {
                console.log('=== ERROR SETUP ===', error.message);
            }

            throw new ServerException(
                error.response?.data?.message || error.message || 'Failed to update profile',
                error.response?.status || 500
            );
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
            
            const response = await this.apiClient.post<ApiResponse<ScanFaceResponse>>(
                ApiEndpoints.renter.scanFace, 
                formData
            );
            
            return {
                success: response.data.success,
                message: response.data.message,
                data: response.data.data,
                code: response.data.code,
            };
        } catch (error: any) {
            this.logger.error(`Failed to scan face: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to scan face', 
                error.response?.status || 500
            );
        }
    }
}