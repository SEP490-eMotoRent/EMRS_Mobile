import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { BookingRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/booking/BookingRemoteDataSourceImpl";
import { ReceiptRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/receipt/ReceiptRemoteDataSourceImpl";

// Repositories
import { BookingRepositoryImpl } from "../../../data/repositories/booking/BookingRepositoryImpl";
import { BookingRepository } from "../../../domain/repositories/booking/BookingRepository";
import { ReceiptRepositoryImpl } from "../../../data/repositories/receipt/ReceiptRepositoryImpl";
import { ReceiptRepository } from "../../../domain/repositories/receipt/ReceiptRepository";

// Use Cases
import { CreateBookingUseCase } from "../../../domain/usecases/booking/CreateBookingUseCase";
import { CreateVNPayBookingUseCase } from "../../../domain/usecases/booking/CreateVNPayBookingUseCase";
import { CreateZaloPayBookingUseCase } from "../../../domain/usecases/booking/zaloPay/CreateZaloPayBookingUseCase";
import { GetBookingByIdUseCase } from "../../../domain/usecases/booking/GetBookingByIdUseCase";
import { GetCurrentRenterBookingsUseCase } from "../../../domain/usecases/booking/GetCurrentRenterBookingsUseCase";
import { CancelBookingUseCase } from "../../../domain/usecases/booking/CancelBookingUseCase";
import { ConfirmVNPayPaymentUseCase } from "../../../domain/usecases/booking/ConfirmVNPayPaymentUseCase";
import { VerifyZaloPayPaymentUseCase } from "../../../domain/usecases/booking/zaloPay/VerifyZaloPayPaymentUseCase";
import { CreateReceiptUseCase } from "../../../domain/usecases/receipt/CreateReceiptUseCase";
import { GenerateContractUseCase } from "../../../domain/usecases/contract/GenerateContractUseCase";
import { GetContractUseCase } from "../../../domain/usecases/contract/GetContractUseCase";

/**
 * BookingModule - All booking-related functionality
 * 
 * Includes:
 * - Booking creation (standard, VNPay, ZaloPay)
 * - Payment processing and confirmation
 * - Booking queries and management
 * - Receipts and contracts
 */
export class BookingModule {
    // Data Sources
    public readonly remoteDataSource: BookingRemoteDataSourceImpl;
    public readonly receiptRemoteDataSource: ReceiptRemoteDataSourceImpl;

    // Repositories
    public readonly repository: BookingRepository;
    public readonly receiptRepository: ReceiptRepository;

    // Use Cases - Organized by feature
    public readonly create = {
        standard: {} as CreateBookingUseCase,
        vnpay: {} as CreateVNPayBookingUseCase,
        zalopay: {} as CreateZaloPayBookingUseCase,
    };

    public readonly payment = {
        confirmVNPay: {} as ConfirmVNPayPaymentUseCase,
        verifyZaloPay: {} as VerifyZaloPayPaymentUseCase,
    };

    public readonly query = {
        getById: {} as GetBookingByIdUseCase,
        getCurrentRenter: {} as GetCurrentRenterBookingsUseCase,
    };

    public readonly management = {
        cancel: {} as CancelBookingUseCase,
    };

    public readonly receipt = {
        create: {} as CreateReceiptUseCase,
    };

    public readonly contract = {
        generate: {} as GenerateContractUseCase,
        get: {} as GetContractUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.remoteDataSource = new BookingRemoteDataSourceImpl(axiosClient);
        this.receiptRemoteDataSource = new ReceiptRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.repository = new BookingRepositoryImpl(this.remoteDataSource);
        this.receiptRepository = new ReceiptRepositoryImpl(this.receiptRemoteDataSource);

        // Initialize create use cases
        this.create.standard = new CreateBookingUseCase(this.repository);
        this.create.vnpay = new CreateVNPayBookingUseCase(this.repository);
        this.create.zalopay = new CreateZaloPayBookingUseCase(this.repository);

        // Initialize payment use cases
        this.payment.confirmVNPay = new ConfirmVNPayPaymentUseCase(this.repository);
        this.payment.verifyZaloPay = new VerifyZaloPayPaymentUseCase(this.repository);

        // Initialize query use cases
        this.query.getById = new GetBookingByIdUseCase(this.repository);
        this.query.getCurrentRenter = new GetCurrentRenterBookingsUseCase(this.repository);

        // Initialize management use cases
        this.management.cancel = new CancelBookingUseCase(this.repository);

        // Initialize receipt use cases
        this.receipt.create = new CreateReceiptUseCase(this.receiptRepository);

        // Initialize contract use cases
        this.contract.generate = new GenerateContractUseCase(this.receiptRepository);
        this.contract.get = new GetContractUseCase(this.receiptRepository);
    }

    static create(axiosClient: AxiosClient): BookingModule {
        return new BookingModule(axiosClient);
    }
}