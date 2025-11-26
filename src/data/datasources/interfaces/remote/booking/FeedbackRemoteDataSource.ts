import { ApiResponse } from "../../../../../core/network/APIResponse";
import { CreateFeedbackRequest } from "../../../../models/feedback/CreateFeedbackRequest";
import { FeedbackResponse } from "../../../../models/feedback/FeedbackResponse";

export interface FeedbackRemoteDataSource {
    createFeedback(request: CreateFeedbackRequest): Promise<ApiResponse<FeedbackResponse>>;
    getFeedbackByBookingId(bookingId: string): Promise<ApiResponse<FeedbackResponse[]>>;
    getFeedbackByVehicleModelId(vehicleModelId: string): Promise<ApiResponse<FeedbackResponse[]>>;
    getAllFeedbacks(): Promise<ApiResponse<FeedbackResponse[]>>;
}