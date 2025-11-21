import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse, unwrapResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { CreateWithdrawalRequest } from "../../../../models/withdrawRequest/CreateWithdrawalRequest";
import { WithdrawalRequestDetailResponse } from "../../../../models/withdrawRequest/WithdrawalRequestDetailResponse";
import { WithdrawalRequestResponse } from "../../../../models/withdrawRequest/WithdrawalRequestResponse";
import { WithdrawalRequestRemoteDataSource } from "../../../interfaces/remote/withdrawRequest/WithdrawalRequestRemoteDataSource";
export class WithdrawalRequestRemoteDataSourceImpl implements WithdrawalRequestRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async createWithdrawalRequest(request: CreateWithdrawalRequest): Promise<WithdrawalRequestResponse> {
        console.log("🌐 [API] POST", ApiEndpoints.withdrawalRequest.create);
        console.log("📤 [API] Request body:", request);
        
        try {
            const response = await this.axiosClient.post<ApiResponse<WithdrawalRequestResponse>>(
                ApiEndpoints.withdrawalRequest.create,
                request
            );
            console.log("📥 [API] Raw response:", response);
            console.log("📥 [API] Response data:", response.data);
            
            const unwrapped = unwrapResponse(response.data);
            console.log("✅ [API] Unwrapped data:", unwrapped);
            return unwrapped;
        } catch (error: any) {
            console.error("❌ [API] Error:", error);
            console.error("❌ [API] Error response:", error.response);
            console.error("❌ [API] Error data:", error.response?.data);
            throw error;
        }
    }

    async getMyWithdrawalRequests(): Promise<WithdrawalRequestResponse[]> {
        console.log("🌐 [API] GET", ApiEndpoints.withdrawalRequest.myRequests);
        
        try {
            const response = await this.axiosClient.get<ApiResponse<WithdrawalRequestResponse[]>>(
                ApiEndpoints.withdrawalRequest.myRequests
            );
            console.log("📥 [API] Response:", response.data);
            return unwrapResponse(response.data);
        } catch (error: any) {
            console.error("❌ [API] Error:", error);
            throw error;
        }
    }

    async getWithdrawalRequestDetail(id: string): Promise<WithdrawalRequestDetailResponse> {
        console.log("🌐 [API] GET", ApiEndpoints.withdrawalRequest.detail(id));
        
        try {
            const response = await this.axiosClient.get<ApiResponse<WithdrawalRequestDetailResponse>>(
                ApiEndpoints.withdrawalRequest.detail(id)
            );
            console.log("📥 [API] Response:", response.data);
            return unwrapResponse(response.data);
        } catch (error: any) {
            console.error("❌ [API] Error:", error);
            throw error;
        }
    }

    async cancelWithdrawalRequest(id: string): Promise<WithdrawalRequestResponse> {
        console.log("🌐 [API] PUT", ApiEndpoints.withdrawalRequest.cancel(id));
        
        try {
            const response = await this.axiosClient.put<ApiResponse<WithdrawalRequestResponse>>(
                ApiEndpoints.withdrawalRequest.cancel(id),
                {}
            );
            console.log("📥 [API] Response:", response.data);
            return unwrapResponse(response.data);
        } catch (error: any) {
            console.error("❌ [API] Error:", error);
            throw error;
        }
    }
}