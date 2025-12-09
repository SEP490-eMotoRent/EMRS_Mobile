import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { FeedbackRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/booking/FeedbackRemoteDataSourceImpl";

// Repositories
import { FeedbackRepositoryImpl } from "../../../data/repositories/booking/FeedbackRepositoryImpl";
import { FeedbackRepository } from "../../../domain/repositories/booking/FeedbackRepository";

// Use Cases
import { CreateFeedbackUseCase } from "../../../domain/usecases/feedback/CreateFeedbackUseCase";
import { GetAllFeedbacksUseCase } from "../../../domain/usecases/feedback/GetAllFeedbacksUseCase";
import { GetFeedbackByBookingIdUseCase } from "../../../domain/usecases/feedback/GetFeedbackByBookingIdUseCase";
import { GetFeedbackByVehicleModelIdUseCase } from "../../../domain/usecases/feedback/GetFeedbackByVehicleModelIdUseCase";

/**
 * FeedbackModule - All feedback and review-related functionality
 * 
 * Includes:
 * - Create feedback/reviews
 * - Get feedback by booking or vehicle model
 */
export class FeedbackModule {
    // Data Sources
    public readonly remoteDataSource: FeedbackRemoteDataSourceImpl;

    // Repositories
    public readonly repository: FeedbackRepository;

    // Use Cases
    public readonly feedback = {
        create: {} as CreateFeedbackUseCase,
        getByBooking: {} as GetFeedbackByBookingIdUseCase,
        getByVehicleModel: {} as GetFeedbackByVehicleModelIdUseCase,
        getAll: {} as GetAllFeedbacksUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.remoteDataSource = new FeedbackRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.repository = new FeedbackRepositoryImpl(this.remoteDataSource);

        // Initialize use cases
        this.feedback.create = new CreateFeedbackUseCase(this.repository);
        this.feedback.getByBooking = new GetFeedbackByBookingIdUseCase(this.repository);
        this.feedback.getByVehicleModel = new GetFeedbackByVehicleModelIdUseCase(this.repository);
        this.feedback.getAll = new GetAllFeedbacksUseCase(this.repository);
    }

    static create(axiosClient: AxiosClient): FeedbackModule {
        return new FeedbackModule(axiosClient);
    }
}