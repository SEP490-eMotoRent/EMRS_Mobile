import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { AdditionalFeeRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/additionalFee/AdditionalFeeRemoteDataSourceImpl";
import { HolidayPricingRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/financial/holidayPricing/HolidayPricingRemoteDataSourceImpl";

// Repositories
import { AdditionalFeeRepositoryImpl } from "../../../data/repositories/additionalFee/AdditionalFeeRepositoryImpl";
import { HolidayPricingRepositoryImpl } from "../../../data/repositories/financial/HolidayPricingRepositoryImpl";
import { HolidayPricingRepository } from "../../../domain/repositories/financial/HolidayPricingRepository";

// Use Cases
import { GetDamageTypesUseCase } from "../../../domain/usecases/additionalFee/GetDamageTypesUseCase";
import { GetAllHolidayPricingsUseCase } from "../../../domain/usecases/holidayPricing/GetAllHolidayPricingsUseCase";
import { GetHolidayPricingByIdUseCase } from "../../../domain/usecases/holidayPricing/GetHolidayPricingByIdUseCase";

/**
 * FinancialModule - All financial and pricing-related functionality
 * 
 * Includes:
 * - Holiday pricing
 * - Additional fees and charges
 */
export class FinancialModule {
    // Data Sources
    public readonly holidayPricingRemoteDataSource: HolidayPricingRemoteDataSourceImpl;
    public readonly additionalFeeRemoteDataSource: AdditionalFeeRemoteDataSourceImpl;

    // Repositories
    public readonly holidayPricingRepository: HolidayPricingRepository;
    public readonly additionalFeeRepository: AdditionalFeeRepositoryImpl;

    // Use Cases - Organized by feature
    public readonly holidayPricing = {
        getAll: {} as GetAllHolidayPricingsUseCase,
        getById: {} as GetHolidayPricingByIdUseCase,
    };

    public readonly additionalFees = {
        getDamageTypes: {} as GetDamageTypesUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.holidayPricingRemoteDataSource = new HolidayPricingRemoteDataSourceImpl(axiosClient);
        this.additionalFeeRemoteDataSource = new AdditionalFeeRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.holidayPricingRepository = new HolidayPricingRepositoryImpl(this.holidayPricingRemoteDataSource);
        this.additionalFeeRepository = new AdditionalFeeRepositoryImpl(this.additionalFeeRemoteDataSource);

        // Initialize holiday pricing use cases
        this.holidayPricing.getAll = new GetAllHolidayPricingsUseCase(this.holidayPricingRepository);
        this.holidayPricing.getById = new GetHolidayPricingByIdUseCase(this.holidayPricingRepository);

        // Initialize additional fees use cases
        this.additionalFees.getDamageTypes = new GetDamageTypesUseCase(this.additionalFeeRepository);
    }

    static create(axiosClient: AxiosClient): FinancialModule {
        return new FinancialModule(axiosClient);
    }
}