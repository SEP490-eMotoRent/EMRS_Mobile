import { ServerException } from "../../../../../core/errors/ServerException";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { AppLogger } from "../../../../../core/utils/Logger";
import { LoginRequest } from "../../../../models/account/accountDTO/LoginRequest";
import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";
import { AccountRemoteDataSource } from "../../../interfaces/remote/account/AccountRemoteDataSource";

export class AccountRemoteDataSourceImpl implements AccountRemoteDataSource {
    private readonly apiClient: AxiosClient;
    private readonly logger = AppLogger.getInstance();

    constructor(apiClient: AxiosClient) {
        this.apiClient = apiClient;
    }

    async create(request: RegisterUserRequest): Promise<RegisterUserRequest> {
        try {
            this.logger.info('🔄 Creating account via API...');
            
            const response = await this.apiClient.post<RegisterUserRequest>(
                '/auth/register',
                request
            );

            this.logger.info('✅ Account created successfully');
            return response.data;
        } catch (error: any) {
            this.logger.error(`❌ Failed to create account: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to register user',
                error.response?.status || 500
            );
        }
    }

    async getByEmail(email: string): Promise<RegisterUserRequest | null> {
        try {
            this.logger.info(`🔄 Fetching account by email: ${email}`);
            
            const response = await this.apiClient.get<RegisterUserRequest>(
                `/auth/user`,
                { email }
            );

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            this.logger.error(`❌ Failed to get account: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to fetch user',
                error.response?.status || 500
            );
        }
    }

    async getAll(): Promise<RegisterUserRequest[]> {
        try {
            this.logger.info('🔄 Fetching all accounts...');
            
            const response = await this.apiClient.get<RegisterUserRequest[]>('/auth/users');

            return response.data;
        } catch (error: any) {
            this.logger.error(`❌ Failed to get accounts: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Failed to fetch users',
                error.response?.status || 500
            );
        }
    }


    async login(request: LoginRequest): Promise<ApiResponse<string>> {
        try {
            this.logger.info('🔄 Logging in user...');
            
            const response = await this.apiClient.post<ApiResponse<string>>(
                '/auth/login',
                request
            );

            this.logger.info('✅ Login successful');
            return response.data;
        } catch (error: any) {
            this.logger.error(`❌ Login failed: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || 'Invalid username or password',
                error.response?.status || 401
            );
        }
    }
}