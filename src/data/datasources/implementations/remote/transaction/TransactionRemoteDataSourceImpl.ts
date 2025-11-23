import { jwtDecode } from "jwt-decode";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse, unwrapResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { ServerException } from "../../../../../core/errors/ServerException";
import { AppLogger } from "../../../../../core/utils/Logger";
import { TransactionResponse } from "../../../../models/transaction/TransactionResponse";
import { TransactionRemoteDataSource } from "../../../interfaces/remote/transaction/TransactionRemoteDataSource";

interface JWTPayload {
    Id: string;
    UserId: string;
    Username: string;
    role: string;
    exp: number;
}

export class TransactionRemoteDataSourceImpl implements TransactionRemoteDataSource {
    private readonly apiClient: AxiosClient;
    private readonly logger = AppLogger.getInstance();

    constructor(apiClient: AxiosClient) {
        this.apiClient = apiClient;
    }

    private getRenterIdFromToken(): string {
        try {
            const token = this.apiClient.getAuthToken();

            if (!token) {
                throw new Error("No authentication token found");
            }

            const decoded = jwtDecode<JWTPayload>(token);

            if (!decoded.UserId) {
                throw new Error("UserId not found in token");
            }

            this.logger.info(`Extracted Renter ID from token: ${decoded.UserId}`);
            return decoded.UserId;
        } catch (error: any) {
            this.logger.error(
                `Failed to extract renter ID from token: ${error.message}`
            );
            throw new ServerException("Invalid authentication token", 401);
        }
    }

    async getMyTransactions(): Promise<TransactionResponse[]> {
        try {
            this.logger.info("Fetching transactions for current renter...");

            const renterId = this.getRenterIdFromToken();

            const response = await this.apiClient.get<ApiResponse<TransactionResponse[]>>(
                ApiEndpoints.transaction.byRenterId(renterId)
            );

            this.logger.info("Transactions fetched successfully");
            return unwrapResponse(response.data);
        } catch (error: any) {
            this.logger.error(`Failed to fetch transactions: ${error.message}`);
            throw new ServerException(
                error.response?.data?.message || "Failed to fetch transactions",
                error.response?.status || 500
            );
        }
    }
}