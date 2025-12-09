import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { RentalReturnRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/rentalReturn/ReceiptRemoteDataSourceImpl';

// Repositories
import { RentalReturnRepositoryImpl } from '../../../data/repositories/rentalReturn/RentalReturnRepositoryImpl';

// Use Cases
import { AiAnalyzeUseCase } from '../../../domain/usecases/rentalReturn/AiAnalyzeUseCase';

/**
 * RentalReturnModule - Complete Rental Return Domain
 * 
 * Handles all rental return functionality:
 * - Vehicle return processing
 * - AI damage analysis
 * - Return receipt generation
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class RentalReturnModule {
    // ==================== REPOSITORIES ====================
    private _repository: RentalReturnRepositoryImpl | null = null;

    // ==================== USE CASES ====================
    private _aiAnalyzeUseCase: AiAnalyzeUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): RentalReturnModule {
        return new RentalReturnModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get repository(): RentalReturnRepositoryImpl {
        if (!this._repository) {
        const remoteDataSource = new RentalReturnRemoteDataSourceImpl(this.axiosClient);
        this._repository = new RentalReturnRepositoryImpl(remoteDataSource);
        }
        return this._repository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * AI damage analysis
     * Usage: container.rentalReturn.aiAnalyze.execute()
     */
    get aiAnalyze(): AiAnalyzeUseCase {
        if (!this._aiAnalyzeUseCase) {
        this._aiAnalyzeUseCase = new AiAnalyzeUseCase(this.repository);
        }
        return this._aiAnalyzeUseCase;
    }
}