import { AppLogger } from "../utils/Logger";
import { AccountLocalDataSourceImpl } from "../../data/datasources/implementations/local/account/AccountLocalDataSourceImpl";
import { RenterLocalDataSourceImpl } from "../../data/datasources/implementations/local/account/RenterLocalDataSourceImpl";

// Account imports
import { AccountRepository } from '../../domain/repositories/account/AccountRepository';
import { AccountRepositoryImpl } from '../../data/repositories/account/AccountRepositoryImpl';
import { AccountRemoteDataSource } from '../../data/datasources/interfaces/remote/account/AccountRemoteDataSource';
import { AccountRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/account/AccountRemoteDataSourceImpl';

// Renter imports
import { RenterRepository } from '../../domain/repositories/account/RenterRepository';
import { RenterRepositoryImpl } from '../../data/repositories/account/RenterRepositoryImpl';
import { RenterRemoteDataSource } from '../../data/datasources/interfaces/remote/account/RenterRemoteDataSource';
import { RenterRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/account/RenterRemoteDataSourceImpl';

// Vehicle imports
import { VehicleRepository } from '../../domain/repositories/vehicle/VehicleRepository';
import { VehicleRepositoryImpl } from '../../data/repositories/vehicle/VehicleRepositoryImpl';
import { VehicleRemoteDataSource } from '../../data/datasources/interfaces/remote/vehicle/VehicleRemoteDataSource';
import { VehicleRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/vehicle/VehicleRemoteDataSourceImpl';

// Vehicle Model imports
import { VehicleModelRepository } from "../../domain/repositories/vehicle/VehicleModelRepository";
import { VehicleModelRepositoryImpl } from "../../data/repositories/vehicle/VehicleModelRepositoryImpl";
import { VehicleModelRemoteDataSource } from "../../data/datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { VehicleModelRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/vehicle/VehicleModelRemoteDataSourceImpl";

// Booking imports
import { BookingRepository } from '../../domain/repositories/booking/BookingRepository';
import { BookingRepositoryImpl } from '../../data/repositories/booking/BookingRepositoryImpl';
import { BookingRemoteDataSource } from '../../data/datasources/interfaces/remote/booking/BookingRemoteDataSource';
import { BookingRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/booking/BookingRemoteDataSourceImpl';
import { CreateBookingUseCase } from '../../domain/usecases/booking/CreateBookingUseCase';
import { GetCurrentRenterBookingsUseCase } from '../../domain/usecases/booking/GetCurrentRenterBookingsUseCase';

// Receipt imports
import { ReceiptRepository } from '../../domain/repositories/receipt/ReceiptRepository';
import { ReceiptRepositoryImpl } from '../../data/repositories/receipt/ReceiptRepositoryImpl';
import { ReceiptRemoteDataSource } from '../../data/datasources/interfaces/remote/receipt/ReceiptRemoteDataSource';
import { ReceiptRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/receipt/ReceiptRemoteDataSourceImpl';
import { CreateHandoverReceiptUseCase } from '../../domain/usecases/receipt/CreateHandoverReceiptUseCase';
import { UpdateRenterProfileUseCase } from "../../domain/usecases/account/Profile/UpdateRenterProfileUseCase";

import { AxiosClient } from "../network/AxiosClient";
import { GenerateContractUseCase } from "../../domain/usecases/receipt/GenerateContractUseCase";

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

  getAxiosClient(): AxiosClient {
    return this.get<AxiosClient>('AxiosClient');
  }
}

const sl = ServiceLocator.getInstance();
export default sl;