import { unwrapResponse } from "../../../core/network/APIResponse";
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
        const data = unwrapResponse(response);
        return FeedbackMapper.toDomain(data);
    }

    async getFeedbackByBookingId(bookingId: string): Promise<Feedback[]> {
        const response = await this.remoteDataSource.getFeedbackByBookingId(bookingId);
        const data = unwrapResponse(response);
        return FeedbackMapper.toDomainList(data);
    }

    async getFeedbackByVehicleModelId(vehicleModelId: string): Promise<Feedback[]> {
        const response = await this.remoteDataSource.getFeedbackByVehicleModelId(vehicleModelId);
        const data = unwrapResponse(response);
        return FeedbackMapper.toDomainList(data);
    }

    async getAllFeedbacks(): Promise<Feedback[]> {
        const response = await this.remoteDataSource.getAllFeedbacks();
        const data = unwrapResponse(response);
        return FeedbackMapper.toDomainList(data);
    }
}