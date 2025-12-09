import { AxiosClient } from "../network/AxiosClient";
import { AppLogger } from "../utils/Logger";

// Import all modules
import { AccountModule } from "./modules/AccountModule";
import { BookingModule } from "./modules/BookingModule";
import { VehicleModule } from "./modules/VehicleModule";
import { WalletModule } from "./modules/WalletModule";
import { InsuranceModule } from "./modules/InsuranceModule";
import { BranchModule } from "./modules/BranchModule";
import { MapsModule } from "./modules/MapsModule";
import { SupportModule } from "./modules/SupportModule";
import { FinancialModule } from "./modules/FinancialModule";
import { ConfigurationModule } from "./modules/ConfigurationModule";
import { FeedbackModule } from "./modules/FeedbackModule";
import { RentalReturnModule } from "./modules/RentalReturnModule";

/**
 * ServiceContainer - Modular Dependency Injection Container
 * 
 * Replaces the old monolithic ServiceLocator with a clean, modular architecture.
 * Each domain is separated into its own module for better organization and maintainability.
 * 
 * Benefits:
 * - Lazy loading (modules created only when accessed)
 * - Clear organization by domain
 * - Easy to test individual modules
 * - No merge conflicts (work on different modules)
 * - ~70-120 lines per module instead of 874 lines in one file
 * 
 * Usage:
 * ```typescript
 * import { container } from '@/core/di/ServiceContainer';
 * 
 * // Account operations
 * await container.account.auth.googleLogin.execute(token);
 * await container.account.otp.verify.execute(email, code);
 * 
 * // Booking operations
 * const booking = await container.booking.create.vnpay.execute(data);
 * await container.booking.payment.confirmVNPay.execute(booking.id);
 * 
 * // Wallet operations
 * const balance = await container.wallet.balance.get.execute();
 * ```
 */
export class ServiceContainer {
    private static instance: ServiceContainer;

    // Core services
    private readonly axiosClient: AxiosClient;
    private readonly logger: AppLogger;

    // Module instances (lazy loaded)
    private _accountModule?: AccountModule;
    private _bookingModule?: BookingModule;
    private _vehicleModule?: VehicleModule;
    private _walletModule?: WalletModule;
    private _insuranceModule?: InsuranceModule;
    private _branchModule?: BranchModule;
    private _mapsModule?: MapsModule;
    private _supportModule?: SupportModule;
    private _financialModule?: FinancialModule;
    private _configurationModule?: ConfigurationModule;
    private _feedbackModule?: FeedbackModule;
    private _rentalReturnModule?: RentalReturnModule;

    private constructor() {
        this.axiosClient = new AxiosClient();
        this.logger = AppLogger.getInstance();
    }

    static getInstance(): ServiceContainer {
        if (!ServiceContainer.instance) {
            ServiceContainer.instance = new ServiceContainer();
        }
        return ServiceContainer.instance;
    }

    // ==================== MODULE GETTERS (Lazy Loading) ====================

    /**
     * Account Module
     * Authentication, OTP, Passwords, Profiles, Documents
     */
    get account(): AccountModule {
        if (!this._accountModule) {
            this._accountModule = AccountModule.create(this.axiosClient);
        }
        return this._accountModule;
    }

    /**
     * Booking Module
     * Bookings, Payments, Receipts, Contracts
     */
    get booking(): BookingModule {
        if (!this._bookingModule) {
            this._bookingModule = BookingModule.create(this.axiosClient);
        }
        return this._bookingModule;
    }

    /**
     * Vehicle Module
     * Vehicles, Vehicle Models, Search
     */
    get vehicle(): VehicleModule {
        if (!this._vehicleModule) {
            this._vehicleModule = VehicleModule.create(this.axiosClient);
        }
        return this._vehicleModule;
    }

    /**
     * Wallet Module
     * Balance, Top-up, Withdrawals, Transactions
     */
    get wallet(): WalletModule {
        if (!this._walletModule) {
            this._walletModule = WalletModule.create(this.axiosClient);
        }
        return this._walletModule;
    }

    /**
     * Insurance Module
     * Claims, Packages
     */
    get insurance(): InsuranceModule {
        if (!this._insuranceModule) {
            this._insuranceModule = InsuranceModule.create(this.axiosClient);
        }
        return this._insuranceModule;
    }

    /**
     * Branch Module
     * Branches, Charging Stations
     */
    get branch(): BranchModule {
        if (!this._branchModule) {
            this._branchModule = BranchModule.create(this.axiosClient);
        }
        return this._branchModule;
    }

    /**
     * Maps Module
     * Geocoding, Places, Search
     */
    get maps(): MapsModule {
        if (!this._mapsModule) {
            this._mapsModule = MapsModule.create();
        }
        return this._mapsModule;
    }

    /**
     * Support Module
     * Tickets, GPS Sharing
     */
    get support(): SupportModule {
        if (!this._supportModule) {
            this._supportModule = SupportModule.create(this.axiosClient);
        }
        return this._supportModule;
    }

    /**
     * Financial Module
     * Holiday Pricing, Additional Fees
     */
    get financial(): FinancialModule {
        if (!this._financialModule) {
            this._financialModule = FinancialModule.create(this.axiosClient);
        }
        return this._financialModule;
    }

    /**
     * Configuration Module
     * System Configurations
     */
    get configuration(): ConfigurationModule {
        if (!this._configurationModule) {
            this._configurationModule = ConfigurationModule.create(this.axiosClient);
        }
        return this._configurationModule;
    }

    /**
     * Feedback Module
     * Reviews, Ratings
     */
    get feedback(): FeedbackModule {
        if (!this._feedbackModule) {
            this._feedbackModule = FeedbackModule.create(this.axiosClient);
        }
        return this._feedbackModule;
    }

    /**
     * Rental Return Module
     * Returns, AI Analysis
     */
    get rentalReturn(): RentalReturnModule {
        if (!this._rentalReturnModule) {
            this._rentalReturnModule = RentalReturnModule.create(this.axiosClient);
        }
        return this._rentalReturnModule;
    }

    // ==================== UTILITY GETTERS ====================

    /**
     * Get AxiosClient instance
     */
    getAxiosClient(): AxiosClient {
        return this.axiosClient;
    }

    /**
     * Get Logger instance
     */
    getLogger(): AppLogger {
        return this.logger;
    }
}

/**
 * Singleton instance for easy access throughout the app
 */
export const container = ServiceContainer.getInstance();

/**
 * Default export for compatibility with old import style
 */
export default container;