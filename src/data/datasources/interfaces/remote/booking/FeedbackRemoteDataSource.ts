import { ApiResponse } from "../../../../../core/network/APIResponse";
import { CreateFeedbackRequest } from "../../../../models/feedback/CreateFeedbackRequest";
import { FeedbackDetailResponse } from "../../../../models/feedback/FeedbackDetailResponse";
import { FeedbackResponse } from "../../../../models/feedback/FeedbackResponse";


export interface FeedbackRemoteDataSource {
    createFeedback(request: CreateFeedbackRequest): Promise<ApiResponse<FeedbackResponse>>;
    getFeedbackByBookingId(bookingId: string): Promise<ApiResponse<FeedbackDetailResponse[]>>;
    getFeedbackByVehicleModelId(vehicleModelId: string): Promise<ApiResponse<FeedbackDetailResponse[]>>;
    getAllFeedbacks(): Promise<ApiResponse<FeedbackDetailResponse[]>>;
}