import { AccountLocalDataSourceImpl } from "../../data/datasources/implementations/local/account/AccountLocalDataSourceImpl";
import { RenterLocalDataSourceImpl } from "../../data/datasources/implementations/local/account/RenterLocalDataSourceImpl";
import { AppLogger } from "../utils/Logger";

// Account imports
import { AccountRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/account/AccountRemoteDataSourceImpl';
import { AccountRepositoryImpl } from '../../data/repositories/account/AccountRepositoryImpl';
import { AccountRepository } from '../../domain/repositories/account/AccountRepository';

// Renter imports
import { RenterRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/account/RenterRemoteDataSourceImpl';
import { RenterRepositoryImpl } from '../../data/repositories/account/RenterRepositoryImpl';
import { RenterRepository } from '../../domain/repositories/account/RenterRepository';
// import { GetCurrentRenterUseCase } from '../../domain/usecases/account/Profile/GetCurrentRenterUseCase'; // ⚠️ SAFE TO COMMENT - Renter only

//Documents Import
// import { DocumentRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/account/DocumentRemoteDataSourceImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { DocumentRepositoryImpl } from "../../data/repositories/account/DocumentRepositoryImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { DocumentRepository } from "../../domain/repositories/account/DocumentRepository"; // ⚠️ SAFE TO COMMENT - Renter only
// import { DeleteDocumentUseCase } from "../../domain/usecases/account/Documents/DeleteDocumentUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CreateDrivingDocumentUseCase } from "../../domain/usecases/account/Documents/DriverLicense/CreateDrivingDocumentUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { UpdateDrivingDocumentUseCase } from "../../domain/usecases/account/Documents/DriverLicense/UpdateDrivingDocumentUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CreateCitizenDocumentUseCase } from "../../domain/usecases/account/Documents/IdentificationCard/CreateCitizenDocumentUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { UpdateCitizenDocumentUseCase } from "../../domain/usecases/account/Documents/IdentificationCard/UpdateCitizenDocumentUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Vehicle imports - ✅ ESSENTIAL - Staff workflows
import { VehicleRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/vehicle/VehicleRemoteDataSourceImpl';
import { VehicleRepositoryImpl } from '../../data/repositories/vehicle/VehicleRepositoryImpl';
import { VehicleRepository } from '../../domain/repositories/vehicle/VehicleRepository';

// Vehicle Model imports - ✅ ESSENTIAL - Staff workflows
import { VehicleModelRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/vehicle/VehicleModelRemoteDataSourceImpl";
import { VehicleModelRepositoryImpl } from "../../data/repositories/vehicle/VehicleModelRepositoryImpl";
import { VehicleModelRepository } from "../../domain/repositories/vehicle/VehicleModelRepository";
import { SearchVehiclesUseCase } from "../../domain/usecases/vehicle/SearchVehiclesUseCase";

// Booking imports - ✅ ESSENTIAL - Staff workflows (partial)
import { BookingRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/booking/BookingRemoteDataSourceImpl';
import { BookingRepositoryImpl } from '../../data/repositories/booking/BookingRepositoryImpl';
import { BookingRepository } from '../../domain/repositories/booking/BookingRepository';
// import { CreateBookingUseCase } from '../../domain/usecases/booking/CreateBookingUseCase'; // ⚠️ SAFE TO COMMENT - Renter only
// import { CreateVNPayBookingUseCase } from "../../domain/usecases/booking/CreateVNPayBookingUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
import { GetBookingByIdUseCase } from '../../domain/usecases/booking/GetBookingByIdUseCase'; // ✅ ESSENTIAL - Staff workflows
import { GetCurrentRenterBookingsUseCase } from '../../domain/usecases/booking/GetCurrentRenterBookingsUseCase'; // ✅ ESSENTIAL - Staff workflows

// Receipt imports - ✅ ESSENTIAL - Staff workflows
import { ReceiptRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/receipt/ReceiptRemoteDataSourceImpl';
import { ReceiptRepositoryImpl } from '../../data/repositories/receipt/ReceiptRepositoryImpl';
import { ReceiptRepository } from '../../domain/repositories/receipt/ReceiptRepository';
// import { UpdateRenterProfileUseCase } from "../../domain/usecases/account/Profile/UpdateRenterProfileUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
import { CreateReceiptUseCase } from '../../domain/usecases/receipt/CreateReceiptUseCase'; // ✅ ESSENTIAL - Staff workflows

import { GenerateContractUseCase } from "../../domain/usecases/contract/GenerateContractUseCase"; // ✅ ESSENTIAL - Staff workflows
import { GetContractUseCase } from "../../domain/usecases/contract/GetContractUseCase"; // ✅ ESSENTIAL - Staff workflows

// Branch imports
import { BranchRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/branch/BranchRemoteDataSourceImpl'; // ⚠️ SAFE TO COMMENT - Renter only
import { BranchRepositoryImpl } from '../../data/repositories/operations/BranchRepositoryImpl'; // ⚠️ SAFE TO COMMENT - Renter only
import { BranchRepository } from '../../domain/repositories/operations/BranchRepository'; // ⚠️ SAFE TO COMMENT - Renter only
import { GetAllBranchesUseCase } from '../../domain/usecases/branch/GetAllBranchesUseCase'; // ⚠️ SAFE TO COMMENT - Renter only
import { GetBranchByIdUseCase } from '../../domain/usecases/branch/GetBranchByIdUseCase'; // ⚠️ SAFE TO COMMENT - Renter only

// Insurance Claim imports
// import { InsuranceClaimRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/insurance/InsuranceClaimRemoteDataSourceImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { InsuranceClaimRepositoryImpl } from "../../data/repositories/insurance/InsuranceClaimRepositoryImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { InsuranceClaimRepository } from "../../domain/repositories/insurance/InsuranceClaimRepository"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CreateInsuranceClaimUseCase } from "../../domain/usecases/insurance/InsuranceClaim/CreateInsuranceClaimUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetInsuranceClaimDetailUseCase } from "../../domain/usecases/insurance/InsuranceClaim/GetInsuranceClaimDetailUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetMyInsuranceClaimsUseCase } from "../../domain/usecases/insurance/InsuranceClaim/GetMyInsuranceClaimsUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Google Maps Imports - ✅ ESSENTIAL - Staff workflows (location services)
import { GeocodingRepositoryImpl } from '../../data/repositories/maps/GeocodingRepositoryImpl';
import { GeocodingRepository } from '../../domain/repositories/map/GeocodingRepository';
import { GetPlaceDetailsUseCase } from '../../domain/usecases/maps/GetPlaceDetailsUseCase';
import { SearchPlacesUseCase } from '../../domain/usecases/maps/SearchPlacesUseCase';

// Insurance Package imports
// import { InsurancePackageRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/insurance/InsurancePackageRemoteDataSourceImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { InsurancePackageRepositoryImpl } from "../../data/repositories/insurance/InsurancePackageRepositoryImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { InsurancePackageRepository } from "../../domain/repositories/insurance/InsurancePackageRepository"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetAllInsurancePackagesUseCase } from "../../domain/usecases/insurance/InsurancePackage/GetAllInsurancePackagesUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetInsurancePackageByIdUseCase } from "../../domain/usecases/insurance/InsurancePackage/GetInsurancePackageByIdUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Mapbox Maps Imports - ✅ ESSENTIAL - Staff workflows (location services)
import { MapboxGeocodingDataSourceImpl } from '../../data/datasources/implementations/remote/maps/MapboxGeocodingDataSourceImpl';

// Rental Return imports - ✅ ESSENTIAL - Staff workflows
import { RentalReturnRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/rentalReturn/ReceiptRemoteDataSourceImpl";
import { RentalReturnRepositoryImpl } from "../../data/repositories/rentalReturn/RentalReturnRepositoryImpl";
import { AiAnalyzeUseCase } from "../../domain/usecases/rentalReturn/AiAnalyzeUseCase"; // ✅ ESSENTIAL - Staff workflows

// Wallet imports
// import { WalletRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/wallet/WalletRemoteDataSourceImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { WalletRepositoryImpl } from "../../data/repositories/wallet/WalletRepositoryImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { WalletRepository } from "../../domain/repositories/wallet/WalletRepository"; // ⚠️ SAFE TO COMMENT - Renter only
// import { ConfirmVNPayPaymentUseCase } from "../../domain/usecases/booking/ConfirmVNPayPaymentUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetBranchesByVehicleModelUseCase } from "../../domain/usecases/branch/GetBranchesByVehicleModelUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { SearchChargingStationsUseCase } from "../../domain/usecases/maps/SearchChargingStationsUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CreateWalletUseCase } from "../../domain/usecases/wallet/CreateWalletUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetWalletBalanceUseCase } from "../../domain/usecases/wallet/GetWalletBalanceUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
import { AxiosClient } from "../network/AxiosClient";

// Configuration imports - ✅ ESSENTIAL - Staff workflows
import { ConfigurationRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/configuration/ConfigurationRemoteDataSourceImpl";
import { ConfigurationRepositoryImpl } from "../../data/repositories/configuration/ConfigurationRepositoryImpl";
// import { GetAllConfigurationsUseCase } from "../../domain/usecases/configuration/GetAllConfigurationsUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetConfigurationByIdUseCase } from "../../domain/usecases/configuration/GetConfigurationByIdUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetConfigurationsByTypeUseCase } from "../../domain/usecases/configuration/GetConfigurationsByTypeUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Charging imports - ✅ ESSENTIAL - Staff workflows
import { ChargingRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/charging/ChargingRemoteDataSourceImpl';
import { ChargingRepositoryImpl } from '../../data/repositories/charging/ChargingRepositoryImpl';
import { ChargingRepository } from '../../domain/repositories/charging/ChargingRepository';
import { GetChargingByLicensePlateUseCase } from "../../domain/usecases/charging/GetChargingByLicensePlateUseCase"; // ✅ ESSENTIAL - Staff workflows

// Holiday Pricing imports
// import { HolidayPricingRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/financial/holidayPricing/HolidayPricingRemoteDataSourceImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { HolidayPricingRepositoryImpl } from "../../data/repositories/financial/HolidayPricingRepositoryImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { HolidayPricingRepository } from "../../domain/repositories/financial/HolidayPricingRepository"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetAllHolidayPricingsUseCase } from "../../domain/usecases/holidayPricing/GetAllHolidayPricingsUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetHolidayPricingByIdUseCase } from "../../domain/usecases/holidayPricing/GetHolidayPricingByIdUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Ticket imports - ✅ ESSENTIAL - Staff workflows
import { TicketRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/ticket/TicketRemoteDataSourceImpl";
import { TicketRepositoryImpl } from "../../data/repositories/ticket/TicketRepositoryImpl";
import { TicketRepository } from "../../domain/repositories/ticket/TicketRepository";
// import { CreateTicketUseCase } from "../../domain/usecases/ticket/CreateTicketUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
import { GetTicketDetailUseCase } from "../../domain/usecases/ticket/GetTicketDetailUseCase"; // ✅ ESSENTIAL - Staff workflows
// import { GetTicketsByBookingIdUseCase } from "../../domain/usecases/ticket/GetTicketsByBookingIdUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Withdrawal Request imports
// import { WithdrawalRequestRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/withdrawRequest/WithdrawalRequestRemoteDataSourceImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { WithdrawalRequestRepositoryImpl } from "../../data/repositories/withdrawRequest/WithdrawalRequestRepositoryImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { WithdrawalRequestRepository } from "../../domain/repositories/withdrawRequest/WithdrawalRequestRepository"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CancelWithdrawalRequestUseCase } from "../../domain/usecases/withdrawRequest/CancelWithdrawalRequestUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CreateWithdrawalRequestUseCase } from "../../domain/usecases/withdrawRequest/CreateWithdrawalRequestUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetMyWithdrawalRequestsUseCase } from "../../domain/usecases/withdrawRequest/GetMyWithdrawalRequestsUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetWithdrawalRequestDetailUseCase } from "../../domain/usecases/withdrawRequest/GetWithdrawalRequestDetailUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Transaction imports
// import { TransactionRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/transaction/TransactionRemoteDataSourceImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { TransactionRepositoryImpl } from "../../data/repositories/financial/TransactionRepositoryImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { TransactionRepository } from "../../domain/repositories/financial/TransactionRepository"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetMyTransactionsUseCase } from "../../domain/usecases/transaction/GetMyTransactionsUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Feedback imports
// import { FeedbackRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/booking/FeedbackRemoteDataSourceImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { FeedbackRepositoryImpl } from "../../data/repositories/booking/FeedbackRepositoryImpl"; // ⚠️ SAFE TO COMMENT - Renter only
// import { FeedbackRepository } from "../../domain/repositories/booking/FeedbackRepository"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CreateFeedbackUseCase } from "../../domain/usecases/feedback/CreateFeedbackUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetAllFeedbacksUseCase } from "../../domain/usecases/feedback/GetAllFeedbacksUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetFeedbackByBookingIdUseCase } from "../../domain/usecases/feedback/GetFeedbackByBookingIdUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GetFeedbackByVehicleModelIdUseCase } from "../../domain/usecases/feedback/GetFeedbackByVehicleModelIdUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

//OTP
// import { ResendOtpUseCase } from "../../domain/usecases/account/OTP/ResendOtpUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { VerifyOtpUseCase } from "../../domain/usecases/account/OTP/VerifyOtpUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Gps Sharing imports - ✅ ESSENTIAL - Staff workflows
import { GpsSharingRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/gpsSharing/GpsSharingRemoteDataSourceImpl";
import { GpsSharingRepositoryImpl } from "../../data/repositories/gpsSharing/GpsSharingRepositoryImpl";
// import { ChangePasswordUseCase } from "../../domain/usecases/account/Passwords/ChangePasswordUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GpsSharingInviteUseCase } from "../../domain/usecases/gpsSharing/GpsSharingInviteUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

// Additional Fee imports - ✅ ESSENTIAL - Staff workflows
import { AdditionalFeeRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/additionalFee/AdditionalFeeRemoteDataSourceImpl";
import { AdditionalFeeRepositoryImpl } from "../../data/repositories/additionalFee/AdditionalFeeRepositoryImpl";
// import { ForgotPasswordUseCase } from "../../domain/usecases/account/Passwords/ForgotPasswordUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { ResetPasswordUseCase } from "../../domain/usecases/account/Passwords/ResetPasswordUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
import { GetDamageTypesUseCase } from "../../domain/usecases/additionalFee/GetDamageTypesUseCase"; // ✅ ESSENTIAL - Staff workflows
// import { CreateZaloPayBookingUseCase } from "../../domain/usecases/booking/zaloPay/CreateZaloPayBookingUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { VerifyZaloPayPaymentUseCase } from "../../domain/usecases/booking/zaloPay/VerifyZaloPayPaymentUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GoogleLoginUseCase } from "../../domain/usecases/account/Google/GoogleLoginUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { GoogleSignInUseCase } from "../../domain/usecases/account/Google/GoogleSignInUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { CreateTopUpRequestUseCase } from "../../domain/usecases/wallet/topUp/CreateTopUpRequestUseCase"; // ⚠️ SAFE TO COMMENT - Renter only
// import { ProcessTopUpCallbackUseCase } from "../../domain/usecases/wallet/topUp/ProcessTopUpCallbackUseCase"; // ⚠️ SAFE TO COMMENT - Renter only

/**
 * Service Locator / Dependency Injection Container
 * Manages all service instances and their dependencies
 * 
 * ✅ ESSENTIAL SERVICES - Required for staff workflows
 * ⚠️ COMMENTED OUT - Renter-only services (safe to keep commented for staff-only builds)
 */
class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, any> = new Map();

  private constructor() {
    // ✅ ESSENTIAL - Core infrastructure
    const axiosClient = new AxiosClient();
    this.services.set("AxiosClient", axiosClient);
    this.services.set("AppLogger", AppLogger.getInstance());

    // ⚠️ SAFE TO COMMENT - Renter only: Account services
    // const accountRemoteDataSource = new AccountRemoteDataSourceImpl(axiosClient);
    // this.services.set("AccountRemoteDataSource", accountRemoteDataSource);
    // const accountRepository = new AccountRepositoryImpl(accountRemoteDataSource);
    // this.services.set("AccountRepository", accountRepository);
    
    // ⚠️ SAFE TO COMMENT - Renter only: Google Sign-In Use Case
    // const googleSignInUseCase = new GoogleSignInUseCase();
    // this.services.set("GoogleSignInUseCase", googleSignInUseCase);
    // const googleLoginUseCase = new GoogleLoginUseCase(accountRepository);
    // this.services.set("GoogleLoginUseCase", googleLoginUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: OTP UseCases
    // const verifyOtpUseCase = new VerifyOtpUseCase(accountRepository);
    // this.services.set("VerifyOtpUseCase", verifyOtpUseCase);
    // const resendOtpUseCase = new ResendOtpUseCase(accountRepository);
    // this.services.set("ResendOtpUseCase", resendOtpUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Local data sources
    // this.services.set("AccountLocalDataSource", new AccountLocalDataSourceImpl());
    const renterLocalDataSource = new RenterLocalDataSourceImpl();
    this.services.set("RenterLocalDataSource", renterLocalDataSource);

    // ✅ ESSENTIAL - Staff workflows: Renter services (for GetByCitizenIdUseCase, ScanFaceUseCase)
    const renterRemoteDataSource = new RenterRemoteDataSourceImpl(axiosClient);
    this.services.set("RenterRemoteDataSource", renterRemoteDataSource);
    const renterRepository = new RenterRepositoryImpl(renterLocalDataSource, renterRemoteDataSource);
    this.services.set("RenterRepository", renterRepository);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const updateRenterProfileUseCase = new UpdateRenterProfileUseCase(renterRepository);
    // this.services.set("UpdateRenterProfileUseCase", updateRenterProfileUseCase);
    // const getCurrentRenterUseCase = new GetCurrentRenterUseCase(renterRepository);
    // this.services.set("GetCurrentRenterUseCase", getCurrentRenterUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Document services
    // const documentRemoteDataSource = new DocumentRemoteDataSourceImpl(axiosClient);
    // this.services.set("DocumentRemoteDataSource", documentRemoteDataSource);
    // const documentRepository = new DocumentRepositoryImpl(documentRemoteDataSource);
    // this.services.set("DocumentRepository", documentRepository);
    // const createCitizenDocumentUseCase = new CreateCitizenDocumentUseCase(documentRepository);
    // this.services.set("CreateCitizenDocumentUseCase", createCitizenDocumentUseCase);
    // const createDrivingDocumentUseCase = new CreateDrivingDocumentUseCase(documentRepository);
    // this.services.set("CreateDrivingDocumentUseCase", createDrivingDocumentUseCase);
    // const updateCitizenDocumentUseCase = new UpdateCitizenDocumentUseCase(documentRepository);
    // this.services.set("UpdateCitizenDocumentUseCase", updateCitizenDocumentUseCase);
    // const updateDrivingDocumentUseCase = new UpdateDrivingDocumentUseCase(documentRepository);
    // this.services.set("UpdateDrivingDocumentUseCase", updateDrivingDocumentUseCase);
    // const deleteDocumentUseCase = new DeleteDocumentUseCase(documentRepository);
    // this.services.set("DeleteDocumentUseCase", deleteDocumentUseCase);

    // ✅ ESSENTIAL - Staff workflows: Vehicle services
    const vehicleRemoteDataSource = new VehicleRemoteDataSourceImpl(axiosClient);
    this.services.set("VehicleRemoteDataSource", vehicleRemoteDataSource);
    const vehicleRepository = new VehicleRepositoryImpl(vehicleRemoteDataSource);
    this.services.set("VehicleRepository", vehicleRepository);

    // ✅ ESSENTIAL - Staff workflows: Vehicle Model services
    const vehicleModelRemoteDataSource = new VehicleModelRemoteDataSourceImpl(axiosClient);
    this.services.set("VehicleModelRemoteDataSource", vehicleModelRemoteDataSource);
    const vehicleModelRepository = new VehicleModelRepositoryImpl(vehicleModelRemoteDataSource);
    this.services.set("VehicleModelRepository", vehicleModelRepository);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    const searchVehiclesUseCase = new SearchVehiclesUseCase(vehicleModelRepository);
    this.services.set("SearchVehiclesUseCase", searchVehiclesUseCase);

    // ✅ ESSENTIAL - Staff workflows: Booking services
    const bookingRemoteDataSource = new BookingRemoteDataSourceImpl(axiosClient);
    this.services.set("BookingRemoteDataSource", bookingRemoteDataSource);
    const bookingRepository = new BookingRepositoryImpl(bookingRemoteDataSource);
    this.services.set("BookingRepository", bookingRepository);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
    // this.services.set("CreateBookingUseCase", createBookingUseCase);
    
    // ✅ ESSENTIAL - Staff workflows
    const getCurrentRenterBookingsUseCase = new GetCurrentRenterBookingsUseCase(bookingRepository);
    this.services.set("GetCurrentRenterBookingsUseCase", getCurrentRenterBookingsUseCase);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const createVNPayBookingUseCase = new CreateVNPayBookingUseCase(bookingRepository);
    // this.services.set("CreateVNPayBookingUseCase", createVNPayBookingUseCase);
    
    // ✅ ESSENTIAL - Staff workflows
    const getBookingByIdUseCase = new GetBookingByIdUseCase(bookingRepository);
    this.services.set("GetBookingByIdUseCase", getBookingByIdUseCase);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);
    // this.services.set("CancelBookingUseCase", cancelBookingUseCase);

    // ✅ ESSENTIAL - Staff workflows: Receipt services
    const receiptRemoteDataSource = new ReceiptRemoteDataSourceImpl(axiosClient);
    this.services.set("ReceiptRemoteDataSource", receiptRemoteDataSource);
    const receiptRepository = new ReceiptRepositoryImpl(receiptRemoteDataSource);
    this.services.set("ReceiptRepository", receiptRepository);
    const createReceiptUseCase = new CreateReceiptUseCase(receiptRepository);
    this.services.set("CreateReceiptUseCase", createReceiptUseCase);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const confirmVNPayPaymentUseCase = new ConfirmVNPayPaymentUseCase(bookingRepository);
    // this.services.set("ConfirmVNPayPaymentUseCase", confirmVNPayPaymentUseCase);
    
    // ✅ ESSENTIAL - Staff workflows
    const generateContractUseCase = new GenerateContractUseCase(receiptRepository);
    this.services.set("GenerateContractUseCase", generateContractUseCase);
    const getContractUseCase = new GetContractUseCase(receiptRepository);
    this.services.set("GetContractUseCase", getContractUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Branch services
    const branchRemoteDataSource = new BranchRemoteDataSourceImpl(axiosClient);
    this.services.set("BranchRemoteDataSource", branchRemoteDataSource);
    const branchRepository = new BranchRepositoryImpl(branchRemoteDataSource);
    this.services.set("BranchRepository", branchRepository);
    const getAllBranchesUseCase = new GetAllBranchesUseCase(branchRepository);
    this.services.set("GetAllBranchesUseCase", getAllBranchesUseCase);
    // const getBranchByIdUseCase = new GetBranchByIdUseCase(branchRepository);
    // this.services.set("GetBranchByIdUseCase", getBranchByIdUseCase);
    // const getBranchesByVehicleModelUseCase = new GetBranchesByVehicleModelUseCase(branchRepository);
    // this.services.set("GetBranchesByVehicleModelUseCase", getBranchesByVehicleModelUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Insurance Claim services
    // const insuranceClaimRemoteDataSource = new InsuranceClaimRemoteDataSourceImpl(axiosClient);
    // this.services.set("InsuranceClaimRemoteDataSource", insuranceClaimRemoteDataSource);
    // const insuranceClaimRepository = new InsuranceClaimRepositoryImpl(insuranceClaimRemoteDataSource);
    // this.services.set("InsuranceClaimRepository", insuranceClaimRepository);
    // const createInsuranceClaimUseCase = new CreateInsuranceClaimUseCase(insuranceClaimRepository);
    // this.services.set("CreateInsuranceClaimUseCase", createInsuranceClaimUseCase);
    // const getMyInsuranceClaimsUseCase = new GetMyInsuranceClaimsUseCase(insuranceClaimRepository);
    // this.services.set("GetMyInsuranceClaimsUseCase", getMyInsuranceClaimsUseCase);
    // const getInsuranceClaimDetailUseCase = new GetInsuranceClaimDetailUseCase(insuranceClaimRepository);
    // this.services.set("GetInsuranceClaimDetailUseCase", getInsuranceClaimDetailUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Insurance Package services
    // const insurancePackageRemoteDataSource = new InsurancePackageRemoteDataSourceImpl(axiosClient);
    // this.services.set("InsurancePackageRemoteDataSource", insurancePackageRemoteDataSource);
    // const insurancePackageRepository = new InsurancePackageRepositoryImpl(insurancePackageRemoteDataSource);
    // this.services.set("InsurancePackageRepository", insurancePackageRepository);
    // const getAllInsurancePackagesUseCase = new GetAllInsurancePackagesUseCase(insurancePackageRepository);
    // this.services.set("GetAllInsurancePackagesUseCase", getAllInsurancePackagesUseCase);
    // const getInsurancePackageByIdUseCase = new GetInsurancePackageByIdUseCase(insurancePackageRepository);
    // this.services.set("GetInsurancePackageByIdUseCase", getInsurancePackageByIdUseCase);

    // ✅ ESSENTIAL - Staff workflows: Gps Sharing services
    const gpsSharingRemoteDataSource = new GpsSharingRemoteDataSourceImpl(axiosClient);
    this.services.set("GpsSharingRemoteDataSource", gpsSharingRemoteDataSource);
    const gpsSharingRepository = new GpsSharingRepositoryImpl(gpsSharingRemoteDataSource);
    this.services.set("GpsSharingRepository", gpsSharingRepository);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const gpsSharingInviteUseCase = new GpsSharingInviteUseCase(gpsSharingRepository);
    // this.services.set("GpsSharingInviteUseCase", gpsSharingInviteUseCase);

    // ✅ ESSENTIAL - Staff workflows: Geocoding services (Maps/Location)
    const geocodingDataSource = new MapboxGeocodingDataSourceImpl();
    this.services.set("GeocodingDataSource", geocodingDataSource);
    const geocodingRepository = new GeocodingRepositoryImpl(geocodingDataSource);
    this.services.set("GeocodingRepository", geocodingRepository);
    const searchPlacesUseCase = new SearchPlacesUseCase(geocodingRepository);
    this.services.set("SearchPlacesUseCase", searchPlacesUseCase);
    const getPlaceDetailsUseCase = new GetPlaceDetailsUseCase(geocodingRepository);
    this.services.set("GetPlaceDetailsUseCase", getPlaceDetailsUseCase);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const searchChargingStationsUseCase = new SearchChargingStationsUseCase(branchRepository);
    // this.services.set("SearchChargingStationsUseCase", searchChargingStationsUseCase);
  
    // ✅ ESSENTIAL - Staff workflows: Rental Return services
    const rentalReturnRemoteDataSource = new RentalReturnRemoteDataSourceImpl(axiosClient);
    this.services.set("RentalReturnRemoteDataSource", rentalReturnRemoteDataSource);
    const rentalReturnRepository = new RentalReturnRepositoryImpl(rentalReturnRemoteDataSource);
    this.services.set("RentalReturnRepository", rentalReturnRepository);
    const analyzeReturnUseCase = new AiAnalyzeUseCase(rentalReturnRepository);
    this.services.set("AiAnalyzeUseCase", analyzeReturnUseCase);

    // ✅ ESSENTIAL - Staff workflows: Charging services
    const chargingRemoteDataSource = new ChargingRemoteDataSourceImpl(axiosClient);
    this.services.set("ChargingRemoteDataSource", chargingRemoteDataSource);
    const chargingRepository = new ChargingRepositoryImpl(chargingRemoteDataSource);
    this.services.set("ChargingRepository", chargingRepository);
    const getChargingByLicensePlateUseCase = new GetChargingByLicensePlateUseCase(chargingRepository);
    this.services.set("GetChargingByLicensePlateUseCase", getChargingByLicensePlateUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Wallet services
    // const walletRemoteDataSource = new WalletRemoteDataSourceImpl(axiosClient);
    // this.services.set("WalletRemoteDataSource", walletRemoteDataSource);
    // const walletRepository = new WalletRepositoryImpl(walletRemoteDataSource);
    // this.services.set("WalletRepository", walletRepository);
    // const createWalletUseCase = new CreateWalletUseCase(walletRepository);
    // this.services.set("CreateWalletUseCase", createWalletUseCase);
    // const getWalletBalanceUseCase = new GetWalletBalanceUseCase(walletRepository);
    // this.services.set("GetWalletBalanceUseCase", getWalletBalanceUseCase);
    // const createTopUpRequestUseCase = new CreateTopUpRequestUseCase(walletRepository);
    // this.services.set("CreateTopUpRequestUseCase", createTopUpRequestUseCase);
    // const processTopUpCallbackUseCase = new ProcessTopUpCallbackUseCase(walletRepository);
    // this.services.set("ProcessTopUpCallbackUseCase", processTopUpCallbackUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Holiday Pricing services
    // const holidayPricingRemoteDataSource = new HolidayPricingRemoteDataSourceImpl(axiosClient);
    // this.services.set("HolidayPricingRemoteDataSource", holidayPricingRemoteDataSource);
    // const holidayPricingRepository = new HolidayPricingRepositoryImpl(holidayPricingRemoteDataSource);
    // this.services.set("HolidayPricingRepository", holidayPricingRepository);
    // const getAllHolidayPricingsUseCase = new GetAllHolidayPricingsUseCase(holidayPricingRepository);
    // this.services.set("GetAllHolidayPricingsUseCase", getAllHolidayPricingsUseCase);
    // const getHolidayPricingByIdUseCase = new GetHolidayPricingByIdUseCase(holidayPricingRepository);
    // this.services.set("GetHolidayPricingByIdUseCase", getHolidayPricingByIdUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Withdrawal Request services
    // const withdrawalRequestRemoteDataSource = new WithdrawalRequestRemoteDataSourceImpl(axiosClient);
    // this.services.set("WithdrawalRequestRemoteDataSource", withdrawalRequestRemoteDataSource);
    // const withdrawalRequestRepository = new WithdrawalRequestRepositoryImpl(withdrawalRequestRemoteDataSource);
    // this.services.set("WithdrawalRequestRepository", withdrawalRequestRepository);
    // const createWithdrawalRequestUseCase = new CreateWithdrawalRequestUseCase(withdrawalRequestRepository);
    // this.services.set("CreateWithdrawalRequestUseCase", createWithdrawalRequestUseCase);
    // const getMyWithdrawalRequestsUseCase = new GetMyWithdrawalRequestsUseCase(withdrawalRequestRepository);
    // this.services.set("GetMyWithdrawalRequestsUseCase", getMyWithdrawalRequestsUseCase);
    // const getWithdrawalRequestDetailUseCase = new GetWithdrawalRequestDetailUseCase(withdrawalRequestRepository);
    // this.services.set("GetWithdrawalRequestDetailUseCase", getWithdrawalRequestDetailUseCase);
    // const cancelWithdrawalRequestUseCase = new CancelWithdrawalRequestUseCase(withdrawalRequestRepository);
    // this.services.set("CancelWithdrawalRequestUseCase", cancelWithdrawalRequestUseCase);

    // ✅ ESSENTIAL - Staff workflows: Configuration services
    const configurationRemoteDataSource = new ConfigurationRemoteDataSourceImpl(axiosClient);
    this.services.set("ConfigurationRemoteDataSource", configurationRemoteDataSource);
    const configurationRepository = new ConfigurationRepositoryImpl(configurationRemoteDataSource);
    this.services.set("ConfigurationRepository", configurationRepository);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const getAllConfigurationsUseCase = new GetAllConfigurationsUseCase(configurationRepository);
    // this.services.set("GetAllConfigurationsUseCase", getAllConfigurationsUseCase);
    // const getConfigurationByIdUseCase = new GetConfigurationByIdUseCase(configurationRepository);
    // this.services.set("GetConfigurationByIdUseCase", getConfigurationByIdUseCase);
    // const getConfigurationsByTypeUseCase = new GetConfigurationsByTypeUseCase(configurationRepository);
    // this.services.set("GetConfigurationsByTypeUseCase", getConfigurationsByTypeUseCase);

    // ✅ ESSENTIAL - Staff workflows: Tickets services
    const ticketRemoteDataSource = new TicketRemoteDataSourceImpl(axiosClient);
    this.services.set("TicketRemoteDataSource", ticketRemoteDataSource);
    const ticketRepository = new TicketRepositoryImpl(ticketRemoteDataSource);
    this.services.set("TicketRepository", ticketRepository);
    
    // ⚠️ SAFE TO COMMENT - Renter only
    // const createTicketUseCase = new CreateTicketUseCase(ticketRepository);
    // this.services.set("CreateTicketUseCase", createTicketUseCase);
    // const getTicketsByBookingIdUseCase = new GetTicketsByBookingIdUseCase(ticketRepository);
    // this.services.set("GetTicketsByBookingIdUseCase", getTicketsByBookingIdUseCase);
    
    // ✅ ESSENTIAL - Staff workflows
    const getTicketDetailUseCase = new GetTicketDetailUseCase(ticketRepository);
    this.services.set("GetTicketDetailUseCase", getTicketDetailUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Transaction services
    // const transactionRemoteDataSource = new TransactionRemoteDataSourceImpl(axiosClient);
    // this.services.set("TransactionRemoteDataSource", transactionRemoteDataSource);
    // const transactionRepository = new TransactionRepositoryImpl(transactionRemoteDataSource);
    // this.services.set("TransactionRepository", transactionRepository);
    // const getMyTransactionsUseCase = new GetMyTransactionsUseCase(transactionRepository);
    // this.services.set("GetMyTransactionsUseCase", getMyTransactionsUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Feedback services
    // const feedbackRemoteDataSource = new FeedbackRemoteDataSourceImpl(axiosClient);
    // this.services.set("FeedbackRemoteDataSource", feedbackRemoteDataSource);
    // const feedbackRepository = new FeedbackRepositoryImpl(feedbackRemoteDataSource);
    // this.services.set("FeedbackRepository", feedbackRepository);
    // const createFeedbackUseCase = new CreateFeedbackUseCase(feedbackRepository);
    // this.services.set("CreateFeedbackUseCase", createFeedbackUseCase);
    // const getFeedbackByBookingIdUseCase = new GetFeedbackByBookingIdUseCase(feedbackRepository);
    // this.services.set("GetFeedbackByBookingIdUseCase", getFeedbackByBookingIdUseCase);
    // const getFeedbackByVehicleModelIdUseCase = new GetFeedbackByVehicleModelIdUseCase(feedbackRepository);
    // this.services.set("GetFeedbackByVehicleModelIdUseCase", getFeedbackByVehicleModelIdUseCase);
    // const getAllFeedbacksUseCase = new GetAllFeedbacksUseCase(feedbackRepository);
    // this.services.set("GetAllFeedbacksUseCase", getAllFeedbacksUseCase);

    // ✅ ESSENTIAL - Staff workflows: Additional Fee services
    const additionalFeeRemoteDataSource = new AdditionalFeeRemoteDataSourceImpl(axiosClient);
    this.services.set("AdditionalFeeRemoteDataSource", additionalFeeRemoteDataSource);
    const additionalFeeRepository = new AdditionalFeeRepositoryImpl(additionalFeeRemoteDataSource);
    this.services.set("AdditionalFeeRepository", additionalFeeRepository);
    const getDamageTypesUseCase = new GetDamageTypesUseCase(additionalFeeRepository);
    this.services.set("GetDamageTypesUseCase", getDamageTypesUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: Password services
    // const changePasswordUseCase = new ChangePasswordUseCase(accountRepository);
    // this.services.set("ChangePasswordUseCase", changePasswordUseCase);
    // const forgotPasswordUseCase = new ForgotPasswordUseCase(accountRepository);
    // this.services.set("ForgotPasswordUseCase", forgotPasswordUseCase);
    // const resetPasswordUseCase = new ResetPasswordUseCase(accountRepository);
    // this.services.set("ResetPasswordUseCase", resetPasswordUseCase);

    // ⚠️ SAFE TO COMMENT - Renter only: ZaloPay services
    // const createZaloPayBookingUseCase = new CreateZaloPayBookingUseCase(bookingRepository);
    // this.services.set("CreateZaloPayBookingUseCase", createZaloPayBookingUseCase);
    // const verifyZaloPayPaymentUseCase = new VerifyZaloPayPaymentUseCase(bookingRepository);
    // this.services.set("VerifyZaloPayPaymentUseCase", verifyZaloPayPaymentUseCase);
  }

  static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found`);
    }
    return service as T;
  }

  // ✅ ESSENTIAL - Type-safe convenience methods for staff workflows
  
  getRenterRepository(): RenterRepository {
    return this.get<RenterRepository>('RenterRepository');
  }

  getVehicleRepository(): VehicleRepository {
    return this.get<VehicleRepository>('VehicleRepository');
  }

  getVehicleModelRepository(): VehicleModelRepository {
    return this.get<VehicleModelRepository>('VehicleModelRepository');
  }

  getBookingRepository(): BookingRepository {
    return this.get<BookingRepository>('BookingRepository');
  }

  getCurrentRenterBookingsUseCase(): GetCurrentRenterBookingsUseCase {
    return this.get<GetCurrentRenterBookingsUseCase>('GetCurrentRenterBookingsUseCase');
  }

  getReceiptRepository(): ReceiptRepository {
    return this.get<ReceiptRepository>('ReceiptRepository');
  }

  getCreateReceiptUseCase(): CreateReceiptUseCase {
    return this.get<CreateReceiptUseCase>('CreateReceiptUseCase');
  }

  getGenerateContractUseCase(): GenerateContractUseCase {
    return this.get<GenerateContractUseCase>('GenerateContractUseCase');
  }

  getGetContractUseCase(): GetContractUseCase {
    return this.get<GetContractUseCase>('GetContractUseCase');
  }

  getGeocodingRepository(): GeocodingRepository {
    return this.get<GeocodingRepository>('GeocodingRepository');
  }

  getSearchPlacesUseCase(): SearchPlacesUseCase {
      return this.get<SearchPlacesUseCase>('SearchPlacesUseCase');
  }

  getGetPlaceDetailsUseCase(): GetPlaceDetailsUseCase {
      return this.get<GetPlaceDetailsUseCase>('GetPlaceDetailsUseCase');
  }

  getAiAnalyzeUseCase(): AiAnalyzeUseCase {
    return this.get<AiAnalyzeUseCase>('AiAnalyzeUseCase');
  }

  getGetBookingByIdUseCase(): GetBookingByIdUseCase {
    return this.get<GetBookingByIdUseCase>('GetBookingByIdUseCase');
  }

  getChargingRepository(): ChargingRepository {
    return this.get<ChargingRepository>('ChargingRepository');
  }

  getGetChargingByLicensePlateUseCase(): GetChargingByLicensePlateUseCase {
    return this.get<GetChargingByLicensePlateUseCase>('GetChargingByLicensePlateUseCase');
  }

  getTicketRepository(): TicketRepository {
    return this.get<TicketRepository>('TicketRepository');
  }

  getGetTicketDetailUseCase(): GetTicketDetailUseCase {
    return this.get<GetTicketDetailUseCase>('GetTicketDetailUseCase');
  }

  getAxiosClient(): AxiosClient {
    return this.get<AxiosClient>('AxiosClient');
  }

  GetAllBranchesUseCase(): GetAllBranchesUseCase {
    return this.get<GetAllBranchesUseCase>('GetAllBranchesUseCase');
  }

  getSearchVehiclesUseCase(): SearchVehiclesUseCase {
    return this.get<SearchVehiclesUseCase>('SearchVehiclesUseCase');
  }
  // ⚠️ SAFE TO COMMENT - Renter only convenience methods (commented out)
  /*
  getAccountRepository(): AccountRepository {
    return this.get<AccountRepository>('AccountRepository');
  }

  getUpdateRenterProfileUseCase(): UpdateRenterProfileUseCase {
    return this.get<UpdateRenterProfileUseCase>('UpdateRenterProfileUseCase');
  }

  getCreateBookingUseCase(): CreateBookingUseCase {
    return this.get<CreateBookingUseCase>('CreateBookingUseCase');
  }

  getBranchRepository(): BranchRepository {
    return this.get<BranchRepository>('BranchRepository');
  }

  GetAllBranchesUseCase(): GetAllBranchesUseCase {
    return this.get<GetAllBranchesUseCase>('GetAllBranchesUseCase');
  }

  getBranchByIdUseCase(): GetBranchByIdUseCase {
    return this.get<GetBranchByIdUseCase>('GetBranchByIdUseCase');
  }

  getInsuranceClaimRepository(): InsuranceClaimRepository {
    return this.get<InsuranceClaimRepository>('InsuranceClaimRepository');
  }

  getCreateInsuranceClaimUseCase(): CreateInsuranceClaimUseCase {
    return this.get<CreateInsuranceClaimUseCase>('CreateInsuranceClaimUseCase');
  }

  getGetMyInsuranceClaimsUseCase(): GetMyInsuranceClaimsUseCase {
    return this.get<GetMyInsuranceClaimsUseCase>('GetMyInsuranceClaimsUseCase');
  }

  getGetInsuranceClaimDetailUseCase(): GetInsuranceClaimDetailUseCase {
    return this.get<GetInsuranceClaimDetailUseCase>('GetInsuranceClaimDetailUseCase');
  }

  getGetCurrentRenterUseCase(): GetCurrentRenterUseCase {
    return this.get<GetCurrentRenterUseCase>('GetCurrentRenterUseCase');
  }

  getDocumentRepository(): DocumentRepository {
    return this.get<DocumentRepository>('DocumentRepository');
  }

  getCreateCitizenDocumentUseCase(): CreateCitizenDocumentUseCase {
    return this.get<CreateCitizenDocumentUseCase>('CreateCitizenDocumentUseCase');
  }

  getCreateDrivingDocumentUseCase(): CreateDrivingDocumentUseCase {
    return this.get<CreateDrivingDocumentUseCase>('CreateDrivingDocumentUseCase');
  }

  getUpdateCitizenDocumentUseCase(): UpdateCitizenDocumentUseCase {
    return this.get<UpdateCitizenDocumentUseCase>('UpdateCitizenDocumentUseCase');
  }

  getUpdateDrivingDocumentUseCase(): UpdateDrivingDocumentUseCase {
    return this.get<UpdateDrivingDocumentUseCase>('UpdateDrivingDocumentUseCase');
  }

  getDeleteDocumentUseCase(): DeleteDocumentUseCase {
    return this.get<DeleteDocumentUseCase>('DeleteDocumentUseCase');
  }

  getInsurancePackageRepository(): InsurancePackageRepository {
    return this.get<InsurancePackageRepository>('InsurancePackageRepository');
  }

  getGetAllInsurancePackagesUseCase(): GetAllInsurancePackagesUseCase {
    return this.get<GetAllInsurancePackagesUseCase>('GetAllInsurancePackagesUseCase');
  }

  getGetInsurancePackageByIdUseCase(): GetInsurancePackageByIdUseCase {
    return this.get<GetInsurancePackageByIdUseCase>('GetInsurancePackageByIdUseCase');
  }

  getSearchVehiclesUseCase(): SearchVehiclesUseCase {
    return this.get<SearchVehiclesUseCase>('SearchVehiclesUseCase');
  }

  getBranchesByVehicleModelUseCase(): GetBranchesByVehicleModelUseCase {
    return this.get<GetBranchesByVehicleModelUseCase>('GetBranchesByVehicleModelUseCase');
  }

  getCreateVNPayBookingUseCase(): CreateVNPayBookingUseCase {
    return this.get<CreateVNPayBookingUseCase>('CreateVNPayBookingUseCase');
  }

  getConfirmVNPayPaymentUseCase(): ConfirmVNPayPaymentUseCase {
    return this.get<ConfirmVNPayPaymentUseCase>("ConfirmVNPayPaymentUseCase");
  }

  getWalletRepository(): WalletRepository {
    return this.get<WalletRepository>('WalletRepository');
  }

  getCreateWalletUseCase(): CreateWalletUseCase {
    return this.get<CreateWalletUseCase>('CreateWalletUseCase');
  }

  getGetWalletBalanceUseCase(): GetWalletBalanceUseCase {
    return this.get<GetWalletBalanceUseCase>('GetWalletBalanceUseCase');
  }

  getSearchChargingStationsUseCase(): SearchChargingStationsUseCase {
    return this.get<SearchChargingStationsUseCase>('SearchChargingStationsUseCase');
  }

  getCancelBookingUseCase(): CancelBookingUseCase {
    return this.get<CancelBookingUseCase>('CancelBookingUseCase');
  }

  getGetAllConfigurationsUseCase(): GetAllConfigurationsUseCase {
    return this.get<GetAllConfigurationsUseCase>('GetAllConfigurationsUseCase');
  }

  getGetConfigurationByIdUseCase(): GetConfigurationByIdUseCase {
    return this.get<GetConfigurationByIdUseCase>('GetConfigurationByIdUseCase');
  }

  getGetConfigurationsByTypeUseCase(): GetConfigurationsByTypeUseCase {
    return this.get<GetConfigurationsByTypeUseCase>('GetConfigurationsByTypeUseCase');
  }

  getGoogleSignInUseCase(): GoogleSignInUseCase {
    return this.get<GoogleSignInUseCase>('GoogleSignInUseCase');
  }

  getGoogleLoginUseCase(): GoogleLoginUseCase {
    return this.get<GoogleLoginUseCase>('GoogleLoginUseCase');
  }

  getWithdrawalRequestRepository(): WithdrawalRequestRepository {
    return this.get<WithdrawalRequestRepository>('WithdrawalRequestRepository');
  }

  getCreateWithdrawalRequestUseCase(): CreateWithdrawalRequestUseCase {
    return this.get<CreateWithdrawalRequestUseCase>('CreateWithdrawalRequestUseCase');
  }

  getGetMyWithdrawalRequestsUseCase(): GetMyWithdrawalRequestsUseCase {
    return this.get<GetMyWithdrawalRequestsUseCase>('GetMyWithdrawalRequestsUseCase');
  }

  getGetWithdrawalRequestDetailUseCase(): GetWithdrawalRequestDetailUseCase {
    return this.get<GetWithdrawalRequestDetailUseCase>('GetWithdrawalRequestDetailUseCase');
  }

  getCancelWithdrawalRequestUseCase(): CancelWithdrawalRequestUseCase {
    return this.get<CancelWithdrawalRequestUseCase>('CancelWithdrawalRequestUseCase');
  }

  getCreateTicketUseCase(): CreateTicketUseCase {
      return this.get<CreateTicketUseCase>('CreateTicketUseCase');
  }

  getGetTicketsByBookingIdUseCase(): GetTicketsByBookingIdUseCase {
      return this.get<GetTicketsByBookingIdUseCase>('GetTicketsByBookingIdUseCase');
  }

  getCreateTopUpRequestUseCase(): CreateTopUpRequestUseCase {
    return this.get<CreateTopUpRequestUseCase>('CreateTopUpRequestUseCase');
  }

  getProcessTopUpCallbackUseCase(): ProcessTopUpCallbackUseCase {
      return this.get<ProcessTopUpCallbackUseCase>('ProcessTopUpCallbackUseCase');
  }

  getHolidayPricingRepository(): HolidayPricingRepository {
    return this.get<HolidayPricingRepository>('HolidayPricingRepository');
  }

  getGetAllHolidayPricingsUseCase(): GetAllHolidayPricingsUseCase {
      return this.get<GetAllHolidayPricingsUseCase>('GetAllHolidayPricingsUseCase');
  }

  getGetHolidayPricingByIdUseCase(): GetHolidayPricingByIdUseCase {
      return this.get<GetHolidayPricingByIdUseCase>('GetHolidayPricingByIdUseCase');
  }

  getTransactionRepository(): TransactionRepository {
    return this.get<TransactionRepository>('TransactionRepository');
  }

  getGetMyTransactionsUseCase(): GetMyTransactionsUseCase {
      return this.get<GetMyTransactionsUseCase>('GetMyTransactionsUseCase');
  }

  getFeedbackRepository(): FeedbackRepository {
    return this.get<FeedbackRepository>('FeedbackRepository');
  }

  getCreateFeedbackUseCase(): CreateFeedbackUseCase {
      return this.get<CreateFeedbackUseCase>('CreateFeedbackUseCase');
  }

  getGetFeedbackByBookingIdUseCase(): GetFeedbackByBookingIdUseCase {
      return this.get<GetFeedbackByBookingIdUseCase>('GetFeedbackByBookingIdUseCase');
  }

  getGetFeedbackByVehicleModelIdUseCase(): GetFeedbackByVehicleModelIdUseCase {
      return this.get<GetFeedbackByVehicleModelIdUseCase>('GetFeedbackByVehicleModelIdUseCase');
  }

  getGetAllFeedbacksUseCase(): GetAllFeedbacksUseCase {
      return this.get<GetAllFeedbacksUseCase>('GetAllFeedbacksUseCase');
  }

  getVerifyOtpUseCase(): VerifyOtpUseCase {
    return this.get<VerifyOtpUseCase>('VerifyOtpUseCase');
  }

  getResendOtpUseCase(): ResendOtpUseCase {
      return this.get<ResendOtpUseCase>('ResendOtpUseCase');
  }

  getChangePasswordUseCase(): ChangePasswordUseCase {
    return this.get<ChangePasswordUseCase>('ChangePasswordUseCase');
  }

  getForgotPasswordUseCase(): ForgotPasswordUseCase {
    return this.get<ForgotPasswordUseCase>('ForgotPasswordUseCase');
  }

  getResetPasswordUseCase(): ResetPasswordUseCase {
      return this.get<ResetPasswordUseCase>('ResetPasswordUseCase');
  }

  getCreateZaloPayBookingUseCase(): CreateZaloPayBookingUseCase {
    return this.get<CreateZaloPayBookingUseCase>('CreateZaloPayBookingUseCase');
  }

  getVerifyZaloPayPaymentUseCase(): VerifyZaloPayPaymentUseCase {
    return this.get<VerifyZaloPayPaymentUseCase>('VerifyZaloPayPaymentUseCase');
  }
  */
}

const sl = ServiceLocator.getInstance();
export default sl;