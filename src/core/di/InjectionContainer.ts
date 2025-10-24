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

    // ✅ Register Account Remote Data Source
    const accountRemoteDataSource = new AccountRemoteDataSourceImpl(axiosClient);
    this.services.set("AccountRemoteDataSource", accountRemoteDataSource);

    // ✅ Register Account Repository
    const accountRepository = new AccountRepositoryImpl(accountRemoteDataSource);
    this.services.set("AccountRepository", accountRepository);

    // Register local data sources (if still needed)
    this.services.set("AccountLocalDataSource", new AccountLocalDataSourceImpl());
    this.services.set("RenterLocalDataSource", new RenterLocalDataSourceImpl());

    // ✅ Register Vehicle services
    const vehicleRemoteDataSource = new VehicleRemoteDataSourceImpl(axiosClient);
    this.services.set("VehicleRemoteDataSource", vehicleRemoteDataSource);

    const vehicleRepository = new VehicleRepositoryImpl(vehicleRemoteDataSource);
    this.services.set("VehicleRepository", vehicleRepository);
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

  getAxiosClient(): AxiosClient {
    return this.get<AxiosClient>('AxiosClient');
  }
}

// Export singleton instance
const sl = ServiceLocator.getInstance();

export default sl;