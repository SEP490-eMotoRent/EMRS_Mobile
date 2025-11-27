import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { CreateFeedbackRequest } from "../../../../models/feedback/CreateFeedbackRequest";
import { FeedbackDetailResponse } from "../../../../models/feedback/FeedbackDetailResponse";
import { FeedbackResponse } from "../../../../models/feedback/FeedbackResponse";
import { FeedbackRemoteDataSource } from "../../../interfaces/remote/booking/FeedbackRemoteDataSource";

export class FeedbackRemoteDataSourceImpl implements FeedbackRemoteDataSource {
    private axiosClient: AxiosClient;

    constructor(axiosClient: AxiosClient) {
        this.axiosClient = axiosClient;
    }

    async createFeedback(request: CreateFeedbackRequest): Promise<ApiResponse<FeedbackResponse>> {
        const response = await this.axiosClient.post<ApiResponse<FeedbackResponse>>(
            ApiEndpoints.feedback.create,
            request
        );
        return response.data;
    }

    async getFeedbackByBookingId(bookingId: string): Promise<ApiResponse<FeedbackDetailResponse[]>> {
        const response = await this.axiosClient.get<ApiResponse<FeedbackDetailResponse[]>>(
            ApiEndpoints.feedback.byBookingId(bookingId)
        );
        return response.data;
    }

    async getFeedbackByVehicleModelId(vehicleModelId: string): Promise<ApiResponse<FeedbackDetailResponse[]>> {
        const response = await this.axiosClient.get<ApiResponse<FeedbackDetailResponse[]>>(
            ApiEndpoints.feedback.byVehicleModelId(vehicleModelId)
        );
        return response.data;
    }

    async getAllFeedbacks(): Promise<ApiResponse<FeedbackDetailResponse[]>> {
        const response = await this.axiosClient.get<ApiResponse<FeedbackDetailResponse[]>>(
            ApiEndpoints.feedback.getAll
        );
        return response.data;
    }
}