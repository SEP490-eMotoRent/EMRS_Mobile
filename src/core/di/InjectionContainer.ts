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
import { GetCurrentRenterUseCase } from '../../domain/usecases/account/Profile/GetCurrentRenterUseCase';

//Documents Import
import { DocumentRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/account/DocumentRemoteDataSourceImpl";
import { DocumentRepositoryImpl } from "../../data/repositories/account/DocumentRepositoryImpl";
import { DocumentRepository } from "../../domain/repositories/account/DocumentRepository";
import { DeleteDocumentUseCase } from "../../domain/usecases/account/Documents/DeleteDocumentUseCase";
import { CreateDrivingDocumentUseCase } from "../../domain/usecases/account/Documents/DriverLicense/CreateDrivingDocumentUseCase";
import { UpdateDrivingDocumentUseCase } from "../../domain/usecases/account/Documents/DriverLicense/UpdateDrivingDocumentUseCase";
import { CreateCitizenDocumentUseCase } from "../../domain/usecases/account/Documents/IdentificationCard/CreateCitizenDocumentUseCase";
import { UpdateCitizenDocumentUseCase } from "../../domain/usecases/account/Documents/IdentificationCard/UpdateCitizenDocumentUseCase";

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
import { GetCurrentRenterBookingsUseCase } from '../../domain/usecases/booking/GetCurrentRenterBookingsUseCase';
import { CreateVNPayBookingUseCase } from "../../domain/usecases/booking/CreateVNPayBookingUseCase";

// Receipt imports
import { ReceiptRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/receipt/ReceiptRemoteDataSourceImpl';
import { ReceiptRepositoryImpl } from '../../data/repositories/receipt/ReceiptRepositoryImpl';
import { ReceiptRepository } from '../../domain/repositories/receipt/ReceiptRepository';
import { UpdateRenterProfileUseCase } from "../../domain/usecases/account/Profile/UpdateRenterProfileUseCase";
import { CreateReceiptUseCase } from '../../domain/usecases/receipt/CreateReceiptUseCase';

import { GenerateContractUseCase } from "../../domain/usecases/contract/GenerateContractUseCase";
import { GetContractUseCase } from "../../domain/usecases/contract/GetContractUseCase";

// Branch imports
import { BranchRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/branch/BranchRemoteDataSourceImpl';
import { BranchRepositoryImpl } from '../../data/repositories/operations/BranchRepositoryImpl';
import { BranchRepository } from '../../domain/repositories/operations/BranchRepository';
import { GetAllBranchesUseCase } from '../../domain/usecases/branch/GetAllBranchesUseCase';
import { GetBranchByIdUseCase } from '../../domain/usecases/branch/GetBranchByIdUseCase';

// Insurance Claim imports
import { InsuranceClaimRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/insurance/InsuranceClaimRemoteDataSourceImpl";
import { InsuranceClaimRepositoryImpl } from "../../data/repositories/insurance/InsuranceClaimRepositoryImpl";
import { InsuranceClaimRepository } from "../../domain/repositories/insurance/InsuranceClaimRepository";
import { CreateInsuranceClaimUseCase } from "../../domain/usecases/insurance/InsuranceClaim/CreateInsuranceClaimUseCase";
import { GetInsuranceClaimDetailUseCase } from "../../domain/usecases/insurance/InsuranceClaim/GetInsuranceClaimDetailUseCase";
import { GetMyInsuranceClaimsUseCase } from "../../domain/usecases/insurance/InsuranceClaim/GetMyInsuranceClaimsUseCase";

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
import { GetBranchesByVehicleModelUseCase } from "../../domain/usecases/branch/GetBranchesByVehicleModelUseCase";
import { AiAnalyzeUseCase } from "../../domain/usecases/rentalReturn/AiAnalyzeUseCase";
import { AxiosClient } from "../network/AxiosClient";

// Charging imports
import { ChargingRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/charging/ChargingRemoteDataSourceImpl';
import { ChargingRepositoryImpl } from '../../data/repositories/charging/ChargingRepositoryImpl';
import { ChargingRepository } from '../../domain/repositories/charging/ChargingRepository';
import { GetChargingByLicensePlateUseCase } from "../../domain/usecases/charging/GetChargingByLicensePlateUseCase";

/**
 * Service Locator / Dependency Injection Container
 * Manages all service instances and their dependencies
 */
class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, any> = new Map();

  private constructor() {
    const axiosClient = new AxiosClient();
    this.services.set("AxiosClient", axiosClient);
    this.services.set("AppLogger", AppLogger.getInstance());

    // Account services
    const accountRemoteDataSource = new AccountRemoteDataSourceImpl(axiosClient);
    this.services.set("AccountRemoteDataSource", accountRemoteDataSource);
    const accountRepository = new AccountRepositoryImpl(accountRemoteDataSource);
    this.services.set("AccountRepository", accountRepository);

    // Local data sources
    this.services.set("AccountLocalDataSource", new AccountLocalDataSourceImpl());
    const renterLocalDataSource = new RenterLocalDataSourceImpl();
    this.services.set("RenterLocalDataSource", renterLocalDataSource);

    // Renter services
    const renterRemoteDataSource = new RenterRemoteDataSourceImpl(axiosClient);
    this.services.set("RenterRemoteDataSource", renterRemoteDataSource);
    const renterRepository = new RenterRepositoryImpl(renterLocalDataSource, renterRemoteDataSource);
    this.services.set("RenterRepository", renterRepository);
    const updateRenterProfileUseCase = new UpdateRenterProfileUseCase(renterRepository);
    this.services.set("UpdateRenterProfileUseCase", updateRenterProfileUseCase);
    const getCurrentRenterUseCase = new GetCurrentRenterUseCase(renterRepository);
    this.services.set("GetCurrentRenterUseCase", getCurrentRenterUseCase);

    // Document services
    const documentRemoteDataSource = new DocumentRemoteDataSourceImpl(axiosClient);
    this.services.set("DocumentRemoteDataSource", documentRemoteDataSource);
    const documentRepository = new DocumentRepositoryImpl(documentRemoteDataSource);
    this.services.set("DocumentRepository", documentRepository);
    const createCitizenDocumentUseCase = new CreateCitizenDocumentUseCase(documentRepository);
    this.services.set("CreateCitizenDocumentUseCase", createCitizenDocumentUseCase);
    const createDrivingDocumentUseCase = new CreateDrivingDocumentUseCase(documentRepository);
    this.services.set("CreateDrivingDocumentUseCase", createDrivingDocumentUseCase);
    const updateCitizenDocumentUseCase = new UpdateCitizenDocumentUseCase(documentRepository);
    this.services.set("UpdateCitizenDocumentUseCase", updateCitizenDocumentUseCase);
    const updateDrivingDocumentUseCase = new UpdateDrivingDocumentUseCase(documentRepository);
    this.services.set("UpdateDrivingDocumentUseCase", updateDrivingDocumentUseCase);
    const deleteDocumentUseCase = new DeleteDocumentUseCase(documentRepository);
    this.services.set("DeleteDocumentUseCase", deleteDocumentUseCase);

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

    // Receipt services
    const receiptRemoteDataSource = new ReceiptRemoteDataSourceImpl(axiosClient);
    this.services.set("ReceiptRemoteDataSource", receiptRemoteDataSource);
    const receiptRepository = new ReceiptRepositoryImpl(receiptRemoteDataSource);
    this.services.set("ReceiptRepository", receiptRepository);
    const createReceiptUseCase = new CreateReceiptUseCase(receiptRepository);
    this.services.set("CreateReceiptUseCase", createReceiptUseCase);

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

    // Insurance Claim services
    const insuranceClaimRemoteDataSource = new InsuranceClaimRemoteDataSourceImpl(axiosClient);
    this.services.set("InsuranceClaimRemoteDataSource", insuranceClaimRemoteDataSource);
    const insuranceClaimRepository = new InsuranceClaimRepositoryImpl(insuranceClaimRemoteDataSource);
    this.services.set("InsuranceClaimRepository", insuranceClaimRepository);
    const createInsuranceClaimUseCase = new CreateInsuranceClaimUseCase(insuranceClaimRepository);
    this.services.set("CreateInsuranceClaimUseCase", createInsuranceClaimUseCase);
    const getMyInsuranceClaimsUseCase = new GetMyInsuranceClaimsUseCase(insuranceClaimRepository);
    this.services.set("GetMyInsuranceClaimsUseCase", getMyInsuranceClaimsUseCase);
    const getInsuranceClaimDetailUseCase = new GetInsuranceClaimDetailUseCase(insuranceClaimRepository);
    this.services.set("GetInsuranceClaimDetailUseCase", getInsuranceClaimDetailUseCase);

    // Insurance Package services
    const insurancePackageRemoteDataSource = new InsurancePackageRemoteDataSourceImpl(axiosClient);
    this.services.set("InsurancePackageRemoteDataSource", insurancePackageRemoteDataSource);
    const insurancePackageRepository = new InsurancePackageRepositoryImpl(insurancePackageRemoteDataSource);
    this.services.set("InsurancePackageRepository", insurancePackageRepository);
    const getAllInsurancePackagesUseCase = new GetAllInsurancePackagesUseCase(insurancePackageRepository);
    this.services.set("GetAllInsurancePackagesUseCase", getAllInsurancePackagesUseCase);
    const getInsurancePackageByIdUseCase = new GetInsurancePackageByIdUseCase(insurancePackageRepository);
    this.services.set("GetInsurancePackageByIdUseCase", getInsurancePackageByIdUseCase);

    // Geocoding services
    const geocodingDataSource = new MapboxGeocodingDataSourceImpl();
    this.services.set("GeocodingDataSource", geocodingDataSource);
    const geocodingRepository = new GeocodingRepositoryImpl(geocodingDataSource);
    this.services.set("GeocodingRepository", geocodingRepository);
    const searchPlacesUseCase = new SearchPlacesUseCase(geocodingRepository);
    this.services.set("SearchPlacesUseCase", searchPlacesUseCase);
    const getPlaceDetailsUseCase = new GetPlaceDetailsUseCase(geocodingRepository);
    this.services.set("GetPlaceDetailsUseCase", getPlaceDetailsUseCase);
  
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

  getUpdateRenterProfileUseCase(): UpdateRenterProfileUseCase {
    return this.get<UpdateRenterProfileUseCase>('UpdateRenterProfileUseCase');
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
}

const sl = ServiceLocator.getInstance();
export default sl;