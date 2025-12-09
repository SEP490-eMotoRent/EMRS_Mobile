import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { FeedbackRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/booking/FeedbackRemoteDataSourceImpl';

// Repositories
import { FeedbackRepositoryImpl } from '../../../data/repositories/booking/FeedbackRepositoryImpl';

// Use Cases
import { CreateFeedbackUseCase } from '../../../domain/usecases/feedback/CreateFeedbackUseCase';
import { GetAllFeedbacksUseCase } from '../../../domain/usecases/feedback/GetAllFeedbacksUseCase';
import { GetFeedbackByBookingIdUseCase } from '../../../domain/usecases/feedback/GetFeedbackByBookingIdUseCase';
import { GetFeedbackByVehicleModelIdUseCase } from '../../../domain/usecases/feedback/GetFeedbackByVehicleModelIdUseCase';

/**
 * FeedbackModule - Complete Feedback Domain
 * 
 * Handles all feedback and review functionality:
 * - Feedback creation
 * - Review browsing
 * - Rating queries
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class FeedbackModule {
    // ==================== REPOSITORIES ====================
    private _repository: FeedbackRepositoryImpl | null = null;

    // ==================== USE CASES ====================
    private _createFeedbackUseCase: CreateFeedbackUseCase | null = null;
    private _getAllFeedbacksUseCase: GetAllFeedbacksUseCase | null = null;
    private _getFeedbackByBookingIdUseCase: GetFeedbackByBookingIdUseCase | null = null;
    private _getFeedbackByVehicleModelIdUseCase: GetFeedbackByVehicleModelIdUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): FeedbackModule {
        return new FeedbackModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get repository(): FeedbackRepositoryImpl {
        if (!this._repository) {
        const remoteDataSource = new FeedbackRemoteDataSourceImpl(this.axiosClient);
        this._repository = new FeedbackRepositoryImpl(remoteDataSource);
        }
        return this._repository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Feedback creation
     * Usage: container.feedback.create.execute()
     */
    get create(): CreateFeedbackUseCase {
        if (!this._createFeedbackUseCase) {
        this._createFeedbackUseCase = new CreateFeedbackUseCase(this.repository);
        }
        return this._createFeedbackUseCase;
    }

    /**
     * Feedback query use cases
     * Usage: container.feedback.get.all.execute()
     */
    get get() {
        return {
        all: this.getAllFeedbacksUseCase,
        byBookingId: this.getFeedbackByBookingIdUseCase,
        byVehicleModelId: this.getFeedbackByVehicleModelIdUseCase,
        };
    }

    // ==================== PRIVATE GETTERS ====================

    private get getAllFeedbacksUseCase(): GetAllFeedbacksUseCase {
        if (!this._getAllFeedbacksUseCase) {
        this._getAllFeedbacksUseCase = new GetAllFeedbacksUseCase(this.repository);
        }
        return this._getAllFeedbacksUseCase;
    }

    private get getFeedbackByBookingIdUseCase(): GetFeedbackByBookingIdUseCase {
        if (!this._getFeedbackByBookingIdUseCase) {
        this._getFeedbackByBookingIdUseCase = new GetFeedbackByBookingIdUseCase(this.repository);
        }
        return this._getFeedbackByBookingIdUseCase;
    }

    private get getFeedbackByVehicleModelIdUseCase(): GetFeedbackByVehicleModelIdUseCase {
        if (!this._getFeedbackByVehicleModelIdUseCase) {
        this._getFeedbackByVehicleModelIdUseCase = new GetFeedbackByVehicleModelIdUseCase(this.repository);
        }
        return this._getFeedbackByVehicleModelIdUseCase;
    }
}