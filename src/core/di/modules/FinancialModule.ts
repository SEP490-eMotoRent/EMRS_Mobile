import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { AdditionalFeeRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/additionalFee/AdditionalFeeRemoteDataSourceImpl';
import { HolidayPricingRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/financial/holidayPricing/HolidayPricingRemoteDataSourceImpl';

// Repositories
import { AdditionalFeeRepositoryImpl } from '../../../data/repositories/additionalFee/AdditionalFeeRepositoryImpl';
import { HolidayPricingRepositoryImpl } from '../../../data/repositories/financial/HolidayPricingRepositoryImpl';

// Use Cases - Holiday Pricing
import { GetAllHolidayPricingsUseCase } from '../../../domain/usecases/holidayPricing/GetAllHolidayPricingsUseCase';
import { GetHolidayPricingByIdUseCase } from '../../../domain/usecases/holidayPricing/GetHolidayPricingByIdUseCase';

// Use Cases - Additional Fees
import { GetDamageTypesUseCase } from '../../../domain/usecases/additionalFee/GetDamageTypesUseCase';

/**
 * FinancialModule - Complete Financial Domain
 * 
 * Handles all financial configuration functionality:
 * - Holiday pricing management
 * - Additional fee structures
 * - Damage type definitions
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class FinancialModule {
    // ==================== REPOSITORIES ====================
    private _holidayPricingRepository: HolidayPricingRepositoryImpl | null = null;
    private _additionalFeeRepository: AdditionalFeeRepositoryImpl | null = null;

    // ==================== USE CASES - HOLIDAY PRICING ====================
    private _getAllHolidayPricingsUseCase: GetAllHolidayPricingsUseCase | null = null;
    private _getHolidayPricingByIdUseCase: GetHolidayPricingByIdUseCase | null = null;

    // ==================== USE CASES - ADDITIONAL FEES ====================
    private _getDamageTypesUseCase: GetDamageTypesUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): FinancialModule {
        return new FinancialModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get holidayPricingRepository(): HolidayPricingRepositoryImpl {
        if (!this._holidayPricingRepository) {
        const remoteDataSource = new HolidayPricingRemoteDataSourceImpl(this.axiosClient);
        this._holidayPricingRepository = new HolidayPricingRepositoryImpl(remoteDataSource);
        }
        return this._holidayPricingRepository;
    }

    get additionalFeeRepository(): AdditionalFeeRepositoryImpl {
        if (!this._additionalFeeRepository) {
        const remoteDataSource = new AdditionalFeeRemoteDataSourceImpl(this.axiosClient);
        this._additionalFeeRepository = new AdditionalFeeRepositoryImpl(remoteDataSource);
        }
        return this._additionalFeeRepository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Holiday pricing use cases
     * Usage: container.financial.holidayPricing.getAll.execute()
     */
    get holidayPricing() {
        return {
        getAll: this.getAllHolidayPricingsUseCase,
        getById: this.getHolidayPricingByIdUseCase,
        };
    }

    /**
     * Additional fee use cases
     * Usage: container.financial.fees.getDamageTypes.execute()
     */
    get fees() {
        return {
        getDamageTypes: this.getDamageTypesUseCase,
        };
    }

    // ==================== PRIVATE GETTERS - HOLIDAY PRICING ====================

    private get getAllHolidayPricingsUseCase(): GetAllHolidayPricingsUseCase {
        if (!this._getAllHolidayPricingsUseCase) {
        this._getAllHolidayPricingsUseCase = new GetAllHolidayPricingsUseCase(this.holidayPricingRepository);
        }
        return this._getAllHolidayPricingsUseCase;
    }

    private get getHolidayPricingByIdUseCase(): GetHolidayPricingByIdUseCase {
        if (!this._getHolidayPricingByIdUseCase) {
        this._getHolidayPricingByIdUseCase = new GetHolidayPricingByIdUseCase(this.holidayPricingRepository);
        }
        return this._getHolidayPricingByIdUseCase;
    }

    // ==================== PRIVATE GETTERS - ADDITIONAL FEES ====================

    private get getDamageTypesUseCase(): GetDamageTypesUseCase {
        if (!this._getDamageTypesUseCase) {
        this._getDamageTypesUseCase = new GetDamageTypesUseCase(this.additionalFeeRepository);
        }
        return this._getDamageTypesUseCase;
    }
}