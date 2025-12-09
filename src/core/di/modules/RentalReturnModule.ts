import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { RentalReturnRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/rentalReturn/ReceiptRemoteDataSourceImpl";

// Repositories
import { RentalReturnRepositoryImpl } from "../../../data/repositories/rentalReturn/RentalReturnRepositoryImpl";

// Use Cases
import { AiAnalyzeUseCase } from "../../../domain/usecases/rentalReturn/AiAnalyzeUseCase";

/**
 * RentalReturnModule - All rental return-related functionality
 * 
 * Includes:
 * - Rental returns
 * - AI damage analysis
 */
export class RentalReturnModule {
    // Data Sources
    public readonly remoteDataSource: RentalReturnRemoteDataSourceImpl;

    // Repositories
    public readonly repository: RentalReturnRepositoryImpl;

    // Use Cases
    public readonly analysis = {
        aiAnalyze: {} as AiAnalyzeUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.remoteDataSource = new RentalReturnRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.repository = new RentalReturnRepositoryImpl(this.remoteDataSource);

        // Initialize use cases
        this.analysis.aiAnalyze = new AiAnalyzeUseCase(this.repository);
    }

    static create(axiosClient: AxiosClient): RentalReturnModule {
        return new RentalReturnModule(axiosClient);
    }
}