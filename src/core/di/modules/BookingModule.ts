import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { BookingRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/booking/BookingRemoteDataSourceImpl';
import { ReceiptRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/receipt/ReceiptRemoteDataSourceImpl';

// Repositories
import { BookingRepositoryImpl } from '../../../data/repositories/booking/BookingRepositoryImpl';
import { ReceiptRepositoryImpl } from '../../../data/repositories/receipt/ReceiptRepositoryImpl';

// Use Cases - Booking
import { CreateBookingUseCase } from '../../../domain/usecases/booking/CreateBookingUseCase';
import { GetCurrentRenterBookingsUseCase } from '../../../domain/usecases/booking/GetCurrentRenterBookingsUseCase';
import { GetBookingByIdUseCase } from '../../../domain/usecases/booking/GetBookingByIdUseCase';
import { CancelBookingUseCase } from '../../../domain/usecases/booking/CancelBookingUseCase';

// Use Cases - VNPay
import { CreateVNPayBookingUseCase } from '../../../domain/usecases/booking/CreateVNPayBookingUseCase';
import { ConfirmVNPayPaymentUseCase } from '../../../domain/usecases/booking/ConfirmVNPayPaymentUseCase';

// Use Cases - ZaloPay
import { CreateZaloPayBookingUseCase } from '../../../domain/usecases/booking/zaloPay/CreateZaloPayBookingUseCase';
import { VerifyZaloPayPaymentUseCase } from '../../../domain/usecases/booking/zaloPay/VerifyZaloPayPaymentUseCase';

// Use Cases - Receipt/Contract
import { CreateReceiptUseCase } from '../../../domain/usecases/receipt/CreateReceiptUseCase';
import { GenerateContractUseCase } from '../../../domain/usecases/contract/GenerateContractUseCase';
import { GetContractUseCase } from '../../../domain/usecases/contract/GetContractUseCase';

/**
 * BookingModule - Complete Booking Domain
 * 
 * Handles all booking-related functionality:
 * - Booking creation and management
 * - VNPay payment integration
 * - ZaloPay payment integration
 * - Receipt generation
 * - Contract generation and retrieval
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class BookingModule {
    // ==================== REPOSITORIES ====================
    private _bookingRepository: BookingRepositoryImpl | null = null;
    private _receiptRepository: ReceiptRepositoryImpl | null = null;

    // ==================== USE CASES - BOOKING ====================
    private _createBookingUseCase: CreateBookingUseCase | null = null;
    private _getCurrentRenterBookingsUseCase: GetCurrentRenterBookingsUseCase | null = null;
    private _getBookingByIdUseCase: GetBookingByIdUseCase | null = null;
    private _cancelBookingUseCase: CancelBookingUseCase | null = null;

    // ==================== USE CASES - VNPAY ====================
    private _createVNPayBookingUseCase: CreateVNPayBookingUseCase | null = null;
    private _confirmVNPayPaymentUseCase: ConfirmVNPayPaymentUseCase | null = null;

    // ==================== USE CASES - ZALOPAY ====================
    private _createZaloPayBookingUseCase: CreateZaloPayBookingUseCase | null = null;
    private _verifyZaloPayPaymentUseCase: VerifyZaloPayPaymentUseCase | null = null;

    // ==================== USE CASES - RECEIPT/CONTRACT ====================
    private _createReceiptUseCase: CreateReceiptUseCase | null = null;
    private _generateContractUseCase: GenerateContractUseCase | null = null;
    private _getContractUseCase: GetContractUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): BookingModule {
        return new BookingModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get repository(): BookingRepositoryImpl {
        if (!this._bookingRepository) {
        const remoteDataSource = new BookingRemoteDataSourceImpl(this.axiosClient);
        this._bookingRepository = new BookingRepositoryImpl(remoteDataSource);
        }
        return this._bookingRepository;
    }

    get receiptRepository(): ReceiptRepositoryImpl {
        if (!this._receiptRepository) {
        const remoteDataSource = new ReceiptRemoteDataSourceImpl(this.axiosClient);
        this._receiptRepository = new ReceiptRepositoryImpl(remoteDataSource);
        }
        return this._receiptRepository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Booking management use cases
     * Usage: container.booking.create.execute()
     */
    get create() {
        return {
        standard: this.createBookingUseCase,
        vnpay: this.createVNPayBookingUseCase,
        zalopay: this.createZaloPayBookingUseCase,
        };
    }

    /**
     * Booking query use cases
     * Usage: container.booking.get.byId.execute()
     */
    get get() {
        return {
        byId: this.getBookingByIdUseCase,
        currentRenter: this.getCurrentRenterBookingsUseCase,
        };
    }

    /**
     * Booking cancellation
     * Usage: container.booking.cancel.execute()
     */
    get cancel(): CancelBookingUseCase {
        return this.cancelBookingUseCase;
    }

    /**
     * Payment confirmation use cases
     * Usage: container.booking.payment.confirmVNPay.execute()
     */
    get payment() {
        return {
        confirmVNPay: this.confirmVNPayPaymentUseCase,
        verifyZaloPay: this.verifyZaloPayPaymentUseCase,
        };
    }

    /**
     * Receipt use cases
     * Usage: container.booking.receipt.create.execute()
     */
    get receipt() {
        return {
        create: this.createReceiptUseCase,
        };
    }

    /**
     * Contract use cases
     * Usage: container.booking.contract.generate.execute()
     */
    get contract() {
        return {
        generate: this.generateContractUseCase,
        get: this.getContractUseCase,
        };
    }

    // ==================== PRIVATE GETTERS - BOOKING ====================

    private get createBookingUseCase(): CreateBookingUseCase {
        if (!this._createBookingUseCase) {
        this._createBookingUseCase = new CreateBookingUseCase(this.repository);
        }
        return this._createBookingUseCase;
    }

    private get getCurrentRenterBookingsUseCase(): GetCurrentRenterBookingsUseCase {
        if (!this._getCurrentRenterBookingsUseCase) {
        this._getCurrentRenterBookingsUseCase = new GetCurrentRenterBookingsUseCase(this.repository);
        }
        return this._getCurrentRenterBookingsUseCase;
    }

    private get getBookingByIdUseCase(): GetBookingByIdUseCase {
        if (!this._getBookingByIdUseCase) {
        this._getBookingByIdUseCase = new GetBookingByIdUseCase(this.repository);
        }
        return this._getBookingByIdUseCase;
    }

    private get cancelBookingUseCase(): CancelBookingUseCase {
        if (!this._cancelBookingUseCase) {
        this._cancelBookingUseCase = new CancelBookingUseCase(this.repository);
        }
        return this._cancelBookingUseCase;
    }

    // ==================== PRIVATE GETTERS - VNPAY ====================

    private get createVNPayBookingUseCase(): CreateVNPayBookingUseCase {
        if (!this._createVNPayBookingUseCase) {
        this._createVNPayBookingUseCase = new CreateVNPayBookingUseCase(this.repository);
        }
        return this._createVNPayBookingUseCase;
    }

    private get confirmVNPayPaymentUseCase(): ConfirmVNPayPaymentUseCase {
        if (!this._confirmVNPayPaymentUseCase) {
        this._confirmVNPayPaymentUseCase = new ConfirmVNPayPaymentUseCase(this.repository);
        }
        return this._confirmVNPayPaymentUseCase;
    }

    // ==================== PRIVATE GETTERS - ZALOPAY ====================

    private get createZaloPayBookingUseCase(): CreateZaloPayBookingUseCase {
        if (!this._createZaloPayBookingUseCase) {
        this._createZaloPayBookingUseCase = new CreateZaloPayBookingUseCase(this.repository);
        }
        return this._createZaloPayBookingUseCase;
    }

    private get verifyZaloPayPaymentUseCase(): VerifyZaloPayPaymentUseCase {
        if (!this._verifyZaloPayPaymentUseCase) {
        this._verifyZaloPayPaymentUseCase = new VerifyZaloPayPaymentUseCase(this.repository);
        }
        return this._verifyZaloPayPaymentUseCase;
    }

    // ==================== PRIVATE GETTERS - RECEIPT/CONTRACT ====================

    private get createReceiptUseCase(): CreateReceiptUseCase {
        if (!this._createReceiptUseCase) {
        this._createReceiptUseCase = new CreateReceiptUseCase(this.receiptRepository);
        }
        return this._createReceiptUseCase;
    }

    private get generateContractUseCase(): GenerateContractUseCase {
        if (!this._generateContractUseCase) {
        this._generateContractUseCase = new GenerateContractUseCase(this.receiptRepository);
        }
        return this._generateContractUseCase;
    }

    private get getContractUseCase(): GetContractUseCase {
        if (!this._getContractUseCase) {
        this._getContractUseCase = new GetContractUseCase(this.receiptRepository);
        }
        return this._getContractUseCase;
    }
}