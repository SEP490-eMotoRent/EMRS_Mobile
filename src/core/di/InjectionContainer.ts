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

// Vehicle imports
import { VehicleRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/vehicle/VehicleRemoteDataSourceImpl';
import { VehicleRepositoryImpl } from '../../data/repositories/vehicle/VehicleRepositoryImpl';
import { VehicleRepository } from '../../domain/repositories/vehicle/VehicleRepository';

// Vehicle Model imports
import { VehicleModelRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/vehicle/VehicleModelRemoteDataSourceImpl";
import { VehicleModelRepositoryImpl } from "../../data/repositories/vehicle/VehicleModelRepositoryImpl";
import { VehicleModelRepository } from "../../domain/repositories/vehicle/VehicleModelRepository";
import { SearchVehiclesUseCase } from "../../domain/usecases/vehicle/SearchVehiclesUseCase";

// Booking imports
import { BookingRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/booking/BookingRemoteDataSourceImpl';
import { BookingRepositoryImpl } from '../../data/repositories/booking/BookingRepositoryImpl';
import { BookingRepository } from '../../domain/repositories/booking/BookingRepository';
import { CreateBookingUseCase } from '../../domain/usecases/booking/CreateBookingUseCase';
import { CreateVNPayBookingUseCase } from "../../domain/usecases/booking/CreateVNPayBookingUseCase";
import { GetBookingByIdUseCase } from '../../domain/usecases/booking/GetBookingByIdUseCase';
import { GetCurrentRenterBookingsUseCase } from '../../domain/usecases/booking/GetCurrentRenterBookingsUseCase';

// Receipt imports
import { ReceiptRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/receipt/ReceiptRemoteDataSourceImpl';
import { ReceiptRepositoryImpl } from '../../data/repositories/receipt/ReceiptRepositoryImpl';
import { ReceiptRepository } from '../../domain/repositories/receipt/ReceiptRepository';
import { CreateReceiptUseCase } from '../../domain/usecases/receipt/CreateReceiptUseCase';

import { GenerateContractUseCase } from "../../domain/usecases/contract/GenerateContractUseCase";
import { GetContractUseCase } from "../../domain/usecases/contract/GetContractUseCase";

// Branch imports
import { BranchRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/branch/BranchRemoteDataSourceImpl';
import { BranchRepositoryImpl } from '../../data/repositories/operations/BranchRepositoryImpl';
import { BranchRepository } from '../../domain/repositories/operations/BranchRepository';
import { GetAllBranchesUseCase } from '../../domain/usecases/branch/GetAllBranchesUseCase';
import { GetBranchByIdUseCase } from '../../domain/usecases/branch/GetBranchByIdUseCase';

// ✅ REMOVED - Insurance Claim Services (Phase 4)
// Was: InsuranceClaimRemoteDataSourceImpl, InsuranceClaimRepositoryImpl
// Was: CreateInsuranceClaimUseCase, GetInsuranceClaimDetailUseCase, GetMyInsuranceClaimsUseCase
// Now using: container.insurance.claims.*

// Google Maps Imports
import { GeocodingRepositoryImpl } from '../../data/repositories/maps/GeocodingRepositoryImpl';
import { GeocodingRepository } from '../../domain/repositories/map/GeocodingRepository';
import { GetPlaceDetailsUseCase } from '../../domain/usecases/maps/GetPlaceDetailsUseCase';
import { SearchPlacesUseCase } from '../../domain/usecases/maps/SearchPlacesUseCase';

// Insurance Package imports
import { InsurancePackageRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/insurance/InsurancePackageRemoteDataSourceImpl";
import { InsurancePackageRepositoryImpl } from "../../data/repositories/insurance/InsurancePackageRepositoryImpl";
import { InsurancePackageRepository } from "../../domain/repositories/insurance/InsurancePackageRepository";
import { GetAllInsurancePackagesUseCase } from "../../domain/usecases/insurance/InsurancePackage/GetAllInsurancePackagesUseCase";
import { GetInsurancePackageByIdUseCase } from "../../domain/usecases/insurance/InsurancePackage/GetInsurancePackageByIdUseCase";

// Mapbox Maps Imports
import { MapboxGeocodingDataSourceImpl } from '../../data/datasources/implementations/remote/maps/MapboxGeocodingDataSourceImpl';

import { RentalReturnRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/rentalReturn/ReceiptRemoteDataSourceImpl";
import { RentalReturnRepositoryImpl } from "../../data/repositories/rentalReturn/RentalReturnRepositoryImpl";
import { ConfirmVNPayPaymentUseCase } from "../../domain/usecases/booking/ConfirmVNPayPaymentUseCase";
import { GetBranchesByVehicleModelUseCase } from "../../domain/usecases/branch/GetBranchesByVehicleModelUseCase";
import { SearchChargingStationsUseCase } from "../../domain/usecases/maps/SearchChargingStationsUseCase";
import { AiAnalyzeUseCase } from "../../domain/usecases/rentalReturn/AiAnalyzeUseCase";
import { AxiosClient } from "../network/AxiosClient";

// Configuration imports
import { ConfigurationRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/configuration/ConfigurationRemoteDataSourceImpl";
import { ConfigurationRepositoryImpl } from "../../data/repositories/configuration/ConfigurationRepositoryImpl";
import { GetAllConfigurationsUseCase } from "../../domain/usecases/configuration/GetAllConfigurationsUseCase";
import { GetConfigurationByIdUseCase } from "../../domain/usecases/configuration/GetConfigurationByIdUseCase";
import { GetConfigurationsByTypeUseCase } from "../../domain/usecases/configuration/GetConfigurationsByTypeUseCase";

// Charging imports
import { ChargingRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/charging/ChargingRemoteDataSourceImpl';
import { HolidayPricingRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/financial/holidayPricing/HolidayPricingRemoteDataSourceImpl";
import { TicketRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/ticket/TicketRemoteDataSourceImpl";
import { ChargingRepositoryImpl } from '../../data/repositories/charging/ChargingRepositoryImpl';
import { HolidayPricingRepositoryImpl } from "../../data/repositories/financial/HolidayPricingRepositoryImpl";
import { TicketRepositoryImpl } from "../../data/repositories/ticket/TicketRepositoryImpl";
import { ChargingRepository } from '../../domain/repositories/charging/ChargingRepository';
import { HolidayPricingRepository } from "../../domain/repositories/financial/HolidayPricingRepository";
import { TicketRepository } from "../../domain/repositories/ticket/TicketRepository";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";
import { GetChargingByLicensePlateUseCase } from "../../domain/usecases/charging/GetChargingByLicensePlateUseCase";

import { GetAllHolidayPricingsUseCase } from "../../domain/usecases/holidayPricing/GetAllHolidayPricingsUseCase";
import { GetHolidayPricingByIdUseCase } from "../../domain/usecases/holidayPricing/GetHolidayPricingByIdUseCase";

import { CreateTicketUseCase } from "../../domain/usecases/ticket/CreateTicketUseCase";
import { GetTicketDetailUseCase } from "../../domain/usecases/ticket/GetTicketDetailUseCase";
import { GetTicketsByBookingIdUseCase } from "../../domain/usecases/ticket/GetTicketsByBookingIdUseCase";

// ✅ REMOVED - Wallet Services (Phase 3)
// Was: WalletRemoteDataSourceImpl, WalletRepositoryImpl
// Was: CreateWalletUseCase, GetWalletBalanceUseCase
// Was: CreateTopUpRequestUseCase, ProcessTopUpCallbackUseCase

// ✅ REMOVED - Withdrawal Request Services (Phase 3)
// Was: WithdrawalRequestRemoteDataSourceImpl, WithdrawalRequestRepositoryImpl
// Was: CreateWithdrawalRequestUseCase, GetMyWithdrawalRequestsUseCase
// Was: GetWithdrawalRequestDetailUseCase, CancelWithdrawalRequestUseCase

// ✅ REMOVED - Transaction Services (Phase 3)
// Was: TransactionRemoteDataSourceImpl, TransactionRepositoryImpl
// Was: GetMyTransactionsUseCase

import { FeedbackRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/booking/FeedbackRemoteDataSourceImpl";
import { FeedbackRepositoryImpl } from "../../data/repositories/booking/FeedbackRepositoryImpl";
import { FeedbackRepository } from "../../domain/repositories/booking/FeedbackRepository";
import { CreateFeedbackUseCase } from "../../domain/usecases/feedback/CreateFeedbackUseCase";
import { GetAllFeedbacksUseCase } from "../../domain/usecases/feedback/GetAllFeedbacksUseCase";
import { GetFeedbackByBookingIdUseCase } from "../../domain/usecases/feedback/GetFeedbackByBookingIdUseCase";
import { GetFeedbackByVehicleModelIdUseCase } from "../../domain/usecases/feedback/GetFeedbackByVehicleModelIdUseCase";

// Gps Sharing imports
import { GpsSharingRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/gpsSharing/GpsSharingRemoteDataSourceImpl";
import { GpsSharingRepositoryImpl } from "../../data/repositories/gpsSharing/GpsSharingRepositoryImpl";
import { GpsSharingInviteUseCase } from "../../domain/usecases/gpsSharing/GpsSharingInviteUseCase";

// Additional Fee imports
import { AdditionalFeeRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/additionalFee/AdditionalFeeRemoteDataSourceImpl";
import { AdditionalFeeRepositoryImpl } from "../../data/repositories/additionalFee/AdditionalFeeRepositoryImpl";
import { GetDamageTypesUseCase } from "../../domain/usecases/additionalFee/GetDamageTypesUseCase";
import { CreateZaloPayBookingUseCase } from "../../domain/usecases/booking/zaloPay/CreateZaloPayBookingUseCase";
import { VerifyZaloPayPaymentUseCase } from "../../domain/usecases/booking/zaloPay/VerifyZaloPayPaymentUseCase";

/**
 * Service Locator / Dependency Injection Container
 * Manages all service instances and their dependencies
 * 
 * 🎯 PHASE 4 CLEANUP - Insurance Claim Services Removed
 * 
 * Previously Removed (Phase 1 - 7 services):
 * - GoogleSignInUseCase → container.account.auth.googleSignIn
 * - GoogleLoginUseCase → container.account.auth.googleLogin
 * - VerifyOtpUseCase → container.account.otp.verify
 * - ResendOtpUseCase → container.account.otp.resend
 * - ChangePasswordUseCase → container.account.passwords.change
 * - ForgotPasswordUseCase → container.account.passwords.forgot
 * - ResetPasswordUseCase → container.account.passwords.reset
 * 
 * Previously Removed (Phase 2 - 7 services):
 * - GetCurrentRenterUseCase → container.account.profile.getCurrent
 * - UpdateRenterProfileUseCase → container.account.profile.update
 * - CreateCitizenDocumentUseCase → container.account.documents.citizen.create
 * - CreateDrivingDocumentUseCase → container.account.documents.driving.create
 * - UpdateCitizenDocumentUseCase → container.account.documents.citizen.update
 * - UpdateDrivingDocumentUseCase → container.account.documents.driving.update
 * - DeleteDocumentUseCase → container.account.documents.delete
 * 
 * Previously Removed (Phase 3 - 12 services):
 * - CreateWalletUseCase → container.wallet.balance.create
 * - GetWalletBalanceUseCase → container.wallet.balance.get
 * - CreateTopUpRequestUseCase → container.wallet.topUp.create
 * - ProcessTopUpCallbackUseCase → container.wallet.topUp.processCallback
 * - CreateWithdrawalRequestUseCase → container.wallet.withdrawal.create
 * - GetMyWithdrawalRequestsUseCase → container.wallet.withdrawal.getMy
 * - GetWithdrawalRequestDetailUseCase → container.wallet.withdrawal.getDetail
 * - CancelWithdrawalRequestUseCase → container.wallet.withdrawal.cancel
 * - GetMyTransactionsUseCase → container.wallet.transactions.getMy
 * - WalletRepository (+ data sources)
 * - WithdrawalRequestRepository (+ data sources)
 * - TransactionRepository (+ data sources)
 * 
 * Now Removed (Phase 4 - 3 services):
 * - GetMyInsuranceClaimsUseCase → container.insurance.claims.getMy
 * - GetInsuranceClaimDetailUseCase → container.insurance.claims.getDetail
 * - CreateInsuranceClaimUseCase → container.insurance.claims.create
 * - InsuranceClaimRepository (+ data sources)
 * 
 * Total Removed: 29/91 services (31.9%)
 * Estimated startup improvement: ~250-350ms
 * Estimated memory savings: ~4-6MB
 */
class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, any> = new Map();

  private constructor() {
    const axiosClient = new AxiosClient();
    this.services.set("AxiosClient", axiosClient);
    this.services.set("AppLogger", AppLogger.getInstance());

    // Account services (kept for backward compatibility)
    const accountRemoteDataSource = new AccountRemoteDataSourceImpl(axiosClient);
    this.services.set("AccountRemoteDataSource", accountRemoteDataSource);
    const accountRepository = new AccountRepositoryImpl(accountRemoteDataSource);
    this.services.set("AccountRepository", accountRepository);

    // Local data sources (kept for backward compatibility)
    this.services.set("AccountLocalDataSource", new AccountLocalDataSourceImpl());
    const renterLocalDataSource = new RenterLocalDataSourceImpl();
    this.services.set("RenterLocalDataSource", renterLocalDataSource);

    // Renter repository (kept for other features)
    const renterRemoteDataSource = new RenterRemoteDataSourceImpl(axiosClient);
    this.services.set("RenterRemoteDataSource", renterRemoteDataSource);
    const renterRepository = new RenterRepositoryImpl(renterLocalDataSource, renterRemoteDataSource);
    this.services.set("RenterRepository", renterRepository);

    // Vehicle services
    const vehicleRemoteDataSource = new VehicleRemoteDataSourceImpl(axiosClient);
    this.services.set("VehicleRemoteDataSource", vehicleRemoteDataSource);
    const vehicleRepository = new VehicleRepositoryImpl(vehicleRemoteDataSource);
    this.services.set("VehicleRepository", vehicleRepository);

    // Vehicle Model services
    const vehicleModelRemoteDataSource = new VehicleModelRemoteDataSourceImpl(axiosClient);
    this.services.set("VehicleModelRemoteDataSource", vehicleModelRemoteDataSource);
    const vehicleModelRepository = new VehicleModelRepositoryImpl(vehicleModelRemoteDataSource);
    this.services.set("VehicleModelRepository", vehicleModelRepository);
    const searchVehiclesUseCase = new SearchVehiclesUseCase(vehicleModelRepository);
    this.services.set("SearchVehiclesUseCase", searchVehiclesUseCase);

    // Booking services
    const bookingRemoteDataSource = new BookingRemoteDataSourceImpl(axiosClient);
    this.services.set("BookingRemoteDataSource", bookingRemoteDataSource);
    const bookingRepository = new BookingRepositoryImpl(bookingRemoteDataSource);
    this.services.set("BookingRepository", bookingRepository);
    const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
    this.services.set("CreateBookingUseCase", createBookingUseCase);
    const getCurrentRenterBookingsUseCase = new GetCurrentRenterBookingsUseCase(bookingRepository);
    this.services.set("GetCurrentRenterBookingsUseCase", getCurrentRenterBookingsUseCase);
    const createVNPayBookingUseCase = new CreateVNPayBookingUseCase(bookingRepository);
    this.services.set("CreateVNPayBookingUseCase", createVNPayBookingUseCase);
    const getBookingByIdUseCase = new GetBookingByIdUseCase(bookingRepository);
    this.services.set("GetBookingByIdUseCase", getBookingByIdUseCase);
    const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);
    this.services.set("CancelBookingUseCase", cancelBookingUseCase);

    // Receipt services
    const receiptRemoteDataSource = new ReceiptRemoteDataSourceImpl(axiosClient);
    this.services.set("ReceiptRemoteDataSource", receiptRemoteDataSource);
    const receiptRepository = new ReceiptRepositoryImpl(receiptRemoteDataSource);
    this.services.set("ReceiptRepository", receiptRepository);
    const createReceiptUseCase = new CreateReceiptUseCase(receiptRepository);
    this.services.set("CreateReceiptUseCase", createReceiptUseCase);
    const confirmVNPayPaymentUseCase = new ConfirmVNPayPaymentUseCase(bookingRepository);
    this.services.set("ConfirmVNPayPaymentUseCase", confirmVNPayPaymentUseCase);
    const generateContractUseCase = new GenerateContractUseCase(receiptRepository);
    this.services.set("GenerateContractUseCase", generateContractUseCase);
    const getContractUseCase = new GetContractUseCase(receiptRepository);
    this.services.set("GetContractUseCase", getContractUseCase);

    // Branch services
    const branchRemoteDataSource = new BranchRemoteDataSourceImpl(axiosClient);
    this.services.set("BranchRemoteDataSource", branchRemoteDataSource);
    const branchRepository = new BranchRepositoryImpl(branchRemoteDataSource);
    this.services.set("BranchRepository", branchRepository);
    const getAllBranchesUseCase = new GetAllBranchesUseCase(branchRepository);
    this.services.set("GetAllBranchesUseCase", getAllBranchesUseCase);
    const getBranchByIdUseCase = new GetBranchByIdUseCase(branchRepository);
    this.services.set("GetBranchByIdUseCase", getBranchByIdUseCase);
    const getBranchesByVehicleModelUseCase = new GetBranchesByVehicleModelUseCase(branchRepository);
    this.services.set("GetBranchesByVehicleModelUseCase", getBranchesByVehicleModelUseCase);

    // ✅ REMOVED - Insurance Claim services (Phase 4)
    // Was: GetMyInsuranceClaimsUseCase, GetInsuranceClaimDetailUseCase, CreateInsuranceClaimUseCase
    // Now using: container.insurance.claims.*

    // Insurance Package services
    const insurancePackageRemoteDataSource = new InsurancePackageRemoteDataSourceImpl(axiosClient);
    this.services.set("InsurancePackageRemoteDataSource", insurancePackageRemoteDataSource);
    const insurancePackageRepository = new InsurancePackageRepositoryImpl(insurancePackageRemoteDataSource);
    this.services.set("InsurancePackageRepository", insurancePackageRepository);
    const getAllInsurancePackagesUseCase = new GetAllInsurancePackagesUseCase(insurancePackageRepository);
    this.services.set("GetAllInsurancePackagesUseCase", getAllInsurancePackagesUseCase);
    const getInsurancePackageByIdUseCase = new GetInsurancePackageByIdUseCase(insurancePackageRepository);
    this.services.set("GetInsurancePackageByIdUseCase", getInsurancePackageByIdUseCase);

    // Gps Sharing services
    const gpsSharingRemoteDataSource = new GpsSharingRemoteDataSourceImpl(axiosClient);
    this.services.set("GpsSharingRemoteDataSource", gpsSharingRemoteDataSource);
    const gpsSharingRepository = new GpsSharingRepositoryImpl(gpsSharingRemoteDataSource);
    this.services.set("GpsSharingRepository", gpsSharingRepository);
    const gpsSharingInviteUseCase = new GpsSharingInviteUseCase(gpsSharingRepository);
    this.services.set("GpsSharingInviteUseCase", gpsSharingInviteUseCase);

    // Geocoding services
    const geocodingDataSource = new MapboxGeocodingDataSourceImpl();
    this.services.set("GeocodingDataSource", geocodingDataSource);
    const geocodingRepository = new GeocodingRepositoryImpl(geocodingDataSource);
    this.services.set("GeocodingRepository", geocodingRepository);
    const searchPlacesUseCase = new SearchPlacesUseCase(geocodingRepository);
    this.services.set("SearchPlacesUseCase", searchPlacesUseCase);
    const getPlaceDetailsUseCase = new GetPlaceDetailsUseCase(geocodingRepository);
    this.services.set("GetPlaceDetailsUseCase", getPlaceDetailsUseCase);
    const searchChargingStationsUseCase = new SearchChargingStationsUseCase(branchRepository);
    this.services.set("SearchChargingStationsUseCase", searchChargingStationsUseCase);
  
    // Rental Return services
    const rentalReturnRemoteDataSource = new RentalReturnRemoteDataSourceImpl(axiosClient);
    this.services.set("RentalReturnRemoteDataSource", rentalReturnRemoteDataSource);
    const rentalReturnRepository = new RentalReturnRepositoryImpl(rentalReturnRemoteDataSource);
    this.services.set("RentalReturnRepository", rentalReturnRepository);
    const analyzeReturnUseCase = new AiAnalyzeUseCase(rentalReturnRepository);
    this.services.set("AiAnalyzeUseCase", analyzeReturnUseCase);

    // Charging services
    const chargingRemoteDataSource = new ChargingRemoteDataSourceImpl(axiosClient);
    this.services.set("ChargingRemoteDataSource", chargingRemoteDataSource);
    const chargingRepository = new ChargingRepositoryImpl(chargingRemoteDataSource);
    this.services.set("ChargingRepository", chargingRepository);
    const getChargingByLicensePlateUseCase = new GetChargingByLicensePlateUseCase(chargingRepository);
    this.services.set("GetChargingByLicensePlateUseCase", getChargingByLicensePlateUseCase);

    // ✅ REMOVED - Wallet Services (Phase 3)
    // Was: WalletRemoteDataSource, WalletRepository
    // Was: CreateWalletUseCase, GetWalletBalanceUseCase
    // Was: CreateTopUpRequestUseCase, ProcessTopUpCallbackUseCase

    // Holiday Pricing services
    const holidayPricingRemoteDataSource = new HolidayPricingRemoteDataSourceImpl(axiosClient);
    this.services.set("HolidayPricingRemoteDataSource", holidayPricingRemoteDataSource);
    const holidayPricingRepository = new HolidayPricingRepositoryImpl(holidayPricingRemoteDataSource);
    this.services.set("HolidayPricingRepository", holidayPricingRepository);
    const getAllHolidayPricingsUseCase = new GetAllHolidayPricingsUseCase(holidayPricingRepository);
    this.services.set("GetAllHolidayPricingsUseCase", getAllHolidayPricingsUseCase);
    const getHolidayPricingByIdUseCase = new GetHolidayPricingByIdUseCase(holidayPricingRepository);
    this.services.set("GetHolidayPricingByIdUseCase", getHolidayPricingByIdUseCase);

    // ✅ REMOVED - Withdrawal Request Services (Phase 3)
    // Was: WithdrawalRequestRemoteDataSource, WithdrawalRequestRepository
    // Was: CreateWithdrawalRequestUseCase, GetMyWithdrawalRequestsUseCase
    // Was: GetWithdrawalRequestDetailUseCase, CancelWithdrawalRequestUseCase

    // Configuration services
    const configurationRemoteDataSource = new ConfigurationRemoteDataSourceImpl(axiosClient);
    this.services.set("ConfigurationRemoteDataSource", configurationRemoteDataSource);
    const configurationRepository = new ConfigurationRepositoryImpl(configurationRemoteDataSource);
    this.services.set("ConfigurationRepository", configurationRepository);
    const getAllConfigurationsUseCase = new GetAllConfigurationsUseCase(configurationRepository);
    this.services.set("GetAllConfigurationsUseCase", getAllConfigurationsUseCase);
    const getConfigurationByIdUseCase = new GetConfigurationByIdUseCase(configurationRepository);
    this.services.set("GetConfigurationByIdUseCase", getConfigurationByIdUseCase);
    const getConfigurationsByTypeUseCase = new GetConfigurationsByTypeUseCase(configurationRepository);
    this.services.set("GetConfigurationsByTypeUseCase", getConfigurationsByTypeUseCase);

    // Tickets services
    const ticketRemoteDataSource = new TicketRemoteDataSourceImpl(axiosClient);
    this.services.set("TicketRemoteDataSource", ticketRemoteDataSource);
    const ticketRepository = new TicketRepositoryImpl(ticketRemoteDataSource);
    this.services.set("TicketRepository", ticketRepository);
    const createTicketUseCase = new CreateTicketUseCase(ticketRepository);
    this.services.set("CreateTicketUseCase", createTicketUseCase);
    const getTicketsByBookingIdUseCase = new GetTicketsByBookingIdUseCase(ticketRepository);
    this.services.set("GetTicketsByBookingIdUseCase", getTicketsByBookingIdUseCase);
    const getTicketDetailUseCase = new GetTicketDetailUseCase(ticketRepository);
    this.services.set("GetTicketDetailUseCase", getTicketDetailUseCase);

    // ✅ REMOVED - Transaction Services (Phase 3)
    // Was: TransactionRemoteDataSource, TransactionRepository
    // Was: GetMyTransactionsUseCase

    // Feedback services
    const feedbackRemoteDataSource = new FeedbackRemoteDataSourceImpl(axiosClient);
    this.services.set("FeedbackRemoteDataSource", feedbackRemoteDataSource);
    const feedbackRepository = new FeedbackRepositoryImpl(feedbackRemoteDataSource);
    this.services.set("FeedbackRepository", feedbackRepository);
    const createFeedbackUseCase = new CreateFeedbackUseCase(feedbackRepository);
    this.services.set("CreateFeedbackUseCase", createFeedbackUseCase);
    const getFeedbackByBookingIdUseCase = new GetFeedbackByBookingIdUseCase(feedbackRepository);
    this.services.set("GetFeedbackByBookingIdUseCase", getFeedbackByBookingIdUseCase);
    const getFeedbackByVehicleModelIdUseCase = new GetFeedbackByVehicleModelIdUseCase(feedbackRepository);
    this.services.set("GetFeedbackByVehicleModelIdUseCase", getFeedbackByVehicleModelIdUseCase);
    const getAllFeedbacksUseCase = new GetAllFeedbacksUseCase(feedbackRepository);
    this.services.set("GetAllFeedbacksUseCase", getAllFeedbacksUseCase);

    // Additional Fee services
    const additionalFeeRemoteDataSource = new AdditionalFeeRemoteDataSourceImpl(axiosClient);
    this.services.set("AdditionalFeeRemoteDataSource", additionalFeeRemoteDataSource);
    const additionalFeeRepository = new AdditionalFeeRepositoryImpl(additionalFeeRemoteDataSource);
    this.services.set("AdditionalFeeRepository", additionalFeeRepository);
    const getDamageTypesUseCase = new GetDamageTypesUseCase(additionalFeeRepository);
    this.services.set("GetDamageTypesUseCase", getDamageTypesUseCase);

    // ZaloPay services
    const createZaloPayBookingUseCase = new CreateZaloPayBookingUseCase(bookingRepository);
    this.services.set("CreateZaloPayBookingUseCase", createZaloPayBookingUseCase);
    const verifyZaloPayPaymentUseCase = new VerifyZaloPayPaymentUseCase(bookingRepository);
    this.services.set("VerifyZaloPayPaymentUseCase", verifyZaloPayPaymentUseCase);
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

  // Type-safe convenience methods
  getAccountRepository(): AccountRepository {
    return this.get<AccountRepository>('AccountRepository');
  }

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

  getCreateBookingUseCase(): CreateBookingUseCase {
    return this.get<CreateBookingUseCase>('CreateBookingUseCase');
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

  getBranchRepository(): BranchRepository {
    return this.get<BranchRepository>('BranchRepository');
  }

  GetAllBranchesUseCase(): GetAllBranchesUseCase {
    return this.get<GetAllBranchesUseCase>('GetAllBranchesUseCase');
  }

  getBranchByIdUseCase(): GetBranchByIdUseCase {
    return this.get<GetBranchByIdUseCase>('GetBranchByIdUseCase');
  }

  // getInsuranceClaimRepository(): InsuranceClaimRepository {
  //   return this.get<InsuranceClaimRepository>('InsuranceClaimRepository');
  // }

  // getCreateInsuranceClaimUseCase(): CreateInsuranceClaimUseCase {
  //   return this.get<CreateInsuranceClaimUseCase>('CreateInsuranceClaimUseCase');
  // }

  // getGetMyInsuranceClaimsUseCase(): GetMyInsuranceClaimsUseCase {
  //   return this.get<GetMyInsuranceClaimsUseCase>('GetMyInsuranceClaimsUseCase');
  // }

  // getGetInsuranceClaimDetailUseCase(): GetInsuranceClaimDetailUseCase {
  //   return this.get<GetInsuranceClaimDetailUseCase>('GetInsuranceClaimDetailUseCase');
  // }

  getGeocodingRepository(): GeocodingRepository {
    return this.get<GeocodingRepository>('GeocodingRepository');
  }

  getSearchPlacesUseCase(): SearchPlacesUseCase {
      return this.get<SearchPlacesUseCase>('SearchPlacesUseCase');
  }

  getGetPlaceDetailsUseCase(): GetPlaceDetailsUseCase {
      return this.get<GetPlaceDetailsUseCase>('GetPlaceDetailsUseCase');
  }

  getAxiosClient(): AxiosClient {
    return this.get<AxiosClient>('AxiosClient');
  }

  getAiAnalyzeUseCase(): AiAnalyzeUseCase {
    return this.get<AiAnalyzeUseCase>('AiAnalyzeUseCase');
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

  getChargingRepository(): ChargingRepository {
    return this.get<ChargingRepository>('ChargingRepository');
  }

  getGetChargingByLicensePlateUseCase(): GetChargingByLicensePlateUseCase {
    return this.get<GetChargingByLicensePlateUseCase>('GetChargingByLicensePlateUseCase');
  }  
  getGetBookingByIdUseCase(): GetBookingByIdUseCase {
    return this.get<GetBookingByIdUseCase>('GetBookingByIdUseCase');
  }

  getConfirmVNPayPaymentUseCase(): ConfirmVNPayPaymentUseCase {
    return this.get<ConfirmVNPayPaymentUseCase>("ConfirmVNPayPaymentUseCase");
  }

  // ✅ REMOVED - Wallet convenience methods (Phase 3)
  // Was: getWalletRepository(), getCreateWalletUseCase(), getGetWalletBalanceUseCase()
  // Was: getCreateTopUpRequestUseCase(), getProcessTopUpCallbackUseCase()

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

  // ✅ REMOVED - Withdrawal Request convenience methods (Phase 3)
  // Was: getWithdrawalRequestRepository()
  // Was: getCreateWithdrawalRequestUseCase(), getGetMyWithdrawalRequestsUseCase()
  // Was: getGetWithdrawalRequestDetailUseCase(), getCancelWithdrawalRequestUseCase()

  getTicketRepository(): TicketRepository {
    return this.get<TicketRepository>('TicketRepository');
  }

  getCreateTicketUseCase(): CreateTicketUseCase {
      return this.get<CreateTicketUseCase>('CreateTicketUseCase');
  }

  getGetTicketsByBookingIdUseCase(): GetTicketsByBookingIdUseCase {
      return this.get<GetTicketsByBookingIdUseCase>('GetTicketsByBookingIdUseCase');
  }

  getGetTicketDetailUseCase(): GetTicketDetailUseCase {
      return this.get<GetTicketDetailUseCase>('GetTicketDetailUseCase');
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

  // ✅ REMOVED - Transaction convenience methods (Phase 3)
  // Was: getTransactionRepository(), getGetMyTransactionsUseCase()

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

  getCreateZaloPayBookingUseCase(): CreateZaloPayBookingUseCase {
    return this.get<CreateZaloPayBookingUseCase>('CreateZaloPayBookingUseCase');
  }

  getVerifyZaloPayPaymentUseCase(): VerifyZaloPayPaymentUseCase {
    return this.get<VerifyZaloPayPaymentUseCase>('VerifyZaloPayPaymentUseCase');
  }
}

const sl = ServiceLocator.getInstance();
export default sl;