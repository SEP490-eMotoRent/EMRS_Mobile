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

// Booking imports
import { BookingRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/booking/BookingRemoteDataSourceImpl';
import { BookingRepositoryImpl } from '../../data/repositories/booking/BookingRepositoryImpl';
import { BookingRepository } from '../../domain/repositories/booking/BookingRepository';
import { CreateBookingUseCase } from '../../domain/usecases/booking/CreateBookingUseCase';
import { GetCurrentRenterBookingsUseCase } from '../../domain/usecases/booking/GetCurrentRenterBookingsUseCase';

// Receipt imports
import { ReceiptRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/receipt/ReceiptRemoteDataSourceImpl';
import { ReceiptRepositoryImpl } from '../../data/repositories/receipt/ReceiptRepositoryImpl';
import { ReceiptRepository } from '../../domain/repositories/receipt/ReceiptRepository';
import { UpdateRenterProfileUseCase } from "../../domain/usecases/account/Profile/UpdateRenterProfileUseCase";
import { CreateHandoverReceiptUseCase } from '../../domain/usecases/receipt/CreateHandoverReceiptUseCase';

import { GenerateContractUseCase } from "../../domain/usecases/receipt/GenerateContractUseCase";
import { GetContractUseCase } from "../../domain/usecases/receipt/GetContractUseCase";

// Branch imports
import { BranchRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/branch/BranchRemoteDataSourceImpl';
import { BranchRepositoryImpl } from '../../data/repositories/operations/BranchRepositoryImpl';
import { BranchRepository } from '../../domain/repositories/operations/BranchRepository';
import { GetAllBranchesUseCase } from '../../domain/usecases/branch/GetAllBranchesUseCase';
import { GetBranchByIdUseCase } from '../../domain/usecases/branch/GetBranchByIdUseCase';

// Google Maps Imports
import { GoogleGeocodingDataSourceImpl } from '../../data/datasources/implementations/remote/maps/GoogleGeocodingDataSourceImpl';
import { GeocodingRepositoryImpl } from '../../data/repositories/maps/GeocodingRepositoryImpl';
import { GeocodingRepository } from '../../domain/repositories/map/GeocodingRepository';
import { SearchPlacesUseCase } from '../../domain/usecases/maps/SearchPlacesUseCase';
import { GetPlaceDetailsUseCase } from '../../domain/usecases/maps/GetPlaceDetailsUseCase';

// Mapbox Maps Imports
import { MapboxGeocodingDataSourceImpl } from '../../data/datasources/implementations/remote/maps/MapboxGeocodingDataSourceImpl';
import { GeocodeAddressUseCase } from '../../domain/usecases/maps/GeocodeAddressUseCase';

import { AxiosClient } from "../network/AxiosClient";

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

    // Booking services
    const bookingRemoteDataSource = new BookingRemoteDataSourceImpl(axiosClient);
    this.services.set("BookingRemoteDataSource", bookingRemoteDataSource);
    const bookingRepository = new BookingRepositoryImpl(bookingRemoteDataSource);
    this.services.set("BookingRepository", bookingRepository);
    const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
    this.services.set("CreateBookingUseCase", createBookingUseCase);
    const getCurrentRenterBookingsUseCase = new GetCurrentRenterBookingsUseCase(bookingRepository);
    this.services.set("GetCurrentRenterBookingsUseCase", getCurrentRenterBookingsUseCase);

    // Receipt services
    const receiptRemoteDataSource = new ReceiptRemoteDataSourceImpl(axiosClient);
    this.services.set("ReceiptRemoteDataSource", receiptRemoteDataSource);
    const receiptRepository = new ReceiptRepositoryImpl(receiptRemoteDataSource);
    this.services.set("ReceiptRepository", receiptRepository);
    const createHandoverReceiptUseCase = new CreateHandoverReceiptUseCase(receiptRepository);
    this.services.set("CreateHandoverReceiptUseCase", createHandoverReceiptUseCase);

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

    // Geocoding services
    // const geocodingDataSource = new GoogleGeocodingDataSourceImpl();
    // this.services.set("GeocodingDataSource", geocodingDataSource);
    // const geocodingRepository = new GeocodingRepositoryImpl(geocodingDataSource);
    // this.services.set("GeocodingRepository", geocodingRepository);
    // const searchPlacesUseCase = new SearchPlacesUseCase(geocodingRepository);
    // this.services.set("SearchPlacesUseCase", searchPlacesUseCase);
    // const getPlaceDetailsUseCase = new GetPlaceDetailsUseCase(geocodingRepository);
    // this.services.set("GetPlaceDetailsUseCase", getPlaceDetailsUseCase);

    // MapBoxes
    const geocodingDataSource = new MapboxGeocodingDataSourceImpl();
    this.services.set("GeocodingDataSource", geocodingDataSource);
    const geocodingRepository = new GeocodingRepositoryImpl(geocodingDataSource);
    this.services.set("GeocodingRepository", geocodingRepository);
    const searchPlacesUseCase = new SearchPlacesUseCase(geocodingRepository);
    this.services.set("SearchPlacesUseCase", searchPlacesUseCase);
    const getPlaceDetailsUseCase = new GetPlaceDetailsUseCase(geocodingRepository);
    this.services.set("GetPlaceDetailsUseCase", getPlaceDetailsUseCase);
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

  getCreateHandoverReceiptUseCase(): CreateHandoverReceiptUseCase {
    return this.get<CreateHandoverReceiptUseCase>('CreateHandoverReceiptUseCase');
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
}

const sl = ServiceLocator.getInstance();
export default sl;