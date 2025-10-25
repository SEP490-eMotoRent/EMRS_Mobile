import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

import { ServerException } from "../errors/ServerException";
import { AppLogger } from "../utils/Logger";
import { AccountLocalDataSourceImpl } from "../../data/datasources/implementations/local/account/AccountLocalDataSourceImpl";
import { RenterLocalDataSourceImpl } from "../../data/datasources/implementations/local/account/RenterLocalDataSourceImpl";

// ✅ Account imports
import { AccountRepository } from '../../domain/repositories/account/AccountRepository';
import { AccountRepositoryImpl } from '../../data/repositories/account/AccountRepositoryImpl';
import { AccountRemoteDataSource } from '../../data/datasources/interfaces/remote/account/AccountRemoteDataSource';
import { AccountRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/account/AccountRemoteDataSourceImpl';

// ✅ Vehicle imports
import { VehicleRepository } from '../../domain/repositories/vehicle/VehicleRepository';
import { VehicleRepositoryImpl } from '../../data/repositories/vehicle/VehicleRepositoryImpl';
import { VehicleRemoteDataSource } from '../../data/datasources/interfaces/remote/vehicle/VehicleRemoteDataSource';
import { VehicleRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/vehicle/VehicleRemoteDataSourceImpl';

// ✅ Vehicle Model imports
import { VehicleModelRepository } from "../../domain/repositories/vehicle/VehicleModelRepository";
import { VehicleModelRepositoryImpl } from "../../data/repositories/vehicle/VehicleModelRepositoryImpl";
import { VehicleModelRemoteDataSource } from "../../data/datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { VehicleModelRemoteDataSourceImpl } from "../../data/datasources/implementations/remote/vehicle/VehicleModelRemoteDataSourceImpl";

// ✅ Booking imports
import { BookingRepository } from '../../domain/repositories/booking/BookingRepository';
import { BookingRepositoryImpl } from '../../data/repositories/booking/BookingRepositoryImpl';
import { BookingRemoteDataSource } from '../../data/datasources/interfaces/remote/booking/BookingRemoteDataSource';
import { BookingRemoteDataSourceImpl } from '../../data/datasources/implementations/remote/booking/BookingRemoteDataSourceImpl';
import { CreateBookingUseCase } from '../../domain/usecases/booking/CreateBookingUseCase';

import { AxiosClient } from "../network/AxiosClient";

/**
 * Service Locator / Dependency Injection Container
 * Manages all service instances and their dependencies
 */
class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, any> = new Map();

  private constructor() {
    // Register core services
    const axiosClient = new AxiosClient();
    this.services.set("AxiosClient", axiosClient);
    this.services.set("AppLogger", AppLogger.getInstance());

    // ✅ Register Account services
    const accountRemoteDataSource = new AccountRemoteDataSourceImpl(axiosClient);
    this.services.set("AccountRemoteDataSource", accountRemoteDataSource);

    const accountRepository = new AccountRepositoryImpl(accountRemoteDataSource);
    this.services.set("AccountRepository", accountRepository);

    // Register local data sources
    this.services.set("AccountLocalDataSource", new AccountLocalDataSourceImpl());
    this.services.set("RenterLocalDataSource", new RenterLocalDataSourceImpl());

    // ✅ Register Vehicle services
    const vehicleRemoteDataSource = new VehicleRemoteDataSourceImpl(axiosClient);
    this.services.set("VehicleRemoteDataSource", vehicleRemoteDataSource);

    const vehicleRepository = new VehicleRepositoryImpl(vehicleRemoteDataSource);
    this.services.set("VehicleRepository", vehicleRepository);

    // ✅ Register Vehicle Model services
    const vehicleModelRemoteDataSource = new VehicleModelRemoteDataSourceImpl(axiosClient);
    this.services.set("VehicleModelRemoteDataSource", vehicleModelRemoteDataSource);

    const vehicleModelRepository = new VehicleModelRepositoryImpl(vehicleModelRemoteDataSource);
    this.services.set("VehicleModelRepository", vehicleModelRepository);

    // ✅ Register Booking services
    const bookingRemoteDataSource = new BookingRemoteDataSourceImpl(axiosClient);
    this.services.set("BookingRemoteDataSource", bookingRemoteDataSource);

    const bookingRepository = new BookingRepositoryImpl(bookingRemoteDataSource);
    this.services.set("BookingRepository", bookingRepository);

    const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
    this.services.set("CreateBookingUseCase", createBookingUseCase);
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

  // ✅ Type-safe convenience methods
  getAccountRepository(): AccountRepository {
    return this.get<AccountRepository>('AccountRepository');
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

  getAxiosClient(): AxiosClient {
    return this.get<AxiosClient>('AxiosClient');
  }
}

// Export singleton instance
const sl = ServiceLocator.getInstance();

export default sl;