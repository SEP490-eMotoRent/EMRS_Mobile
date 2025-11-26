import { CreateFeedbackInput, Feedback } from "../../../domain/entities/booking/Feedback";
import { FeedbackRepository } from "../../../domain/repositories/booking/FeedbackRepository";
import { FeedbackRemoteDataSource } from "../../datasources/interfaces/remote/booking/FeedbackRemoteDataSource";
import { FeedbackMapper } from "../../mappers/feedback/FeedbackMapper";

export class FeedbackRepositoryImpl implements FeedbackRepository {
    private remoteDataSource: FeedbackRemoteDataSource;

    constructor(remoteDataSource: FeedbackRemoteDataSource) {
        this.remoteDataSource = remoteDataSource;
    }

    async createFeedback(input: CreateFeedbackInput): Promise<Feedback> {
        const response = await this.remoteDataSource.createFeedback({
            rating: input.rating,
            comment: input.comment,
            bookingId: input.bookingId,
        });

        if (!response.success || !response.data) {
            throw new Error(response.message || "Failed to create feedback");
        }

        // POST /create returns FeedbackResponseDTO (with renterId)
        return FeedbackMapper.fromResponseDTO(response.data);
    }

    async getFeedbackByBookingId(bookingId: string): Promise<Feedback[]> {
        const response = await this.remoteDataSource.getFeedbackByBookingId(bookingId);

        if (!response.success || !response.data) {
            return [];
        }

        // GET returns FeedbackDetailDTO[] (with renterName)
        return FeedbackMapper.fromDetailDTOList(response.data);
    }

    async getFeedbackByVehicleModelId(vehicleModelId: string): Promise<Feedback[]> {
        const response = await this.remoteDataSource.getFeedbackByVehicleModelId(vehicleModelId);

        if (!response.success || !response.data) {
            return [];
        }

        // GET returns FeedbackDetailDTO[] (with renterName)
        return FeedbackMapper.fromDetailDTOList(response.data);
    }

    async getAllFeedbacks(): Promise<Feedback[]> {
        const response = await this.remoteDataSource.getAllFeedbacks();

        if (!response.success || !response.data) {
            return [];
        }

        // GET returns FeedbackDetailDTO[] (with renterName)
        return FeedbackMapper.fromDetailDTOList(response.data);
    }
}