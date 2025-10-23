import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

import { ServerException } from "../errors/ServerException";
import { AppLogger } from "../utils/Logger";
import { AccountLocalDataSourceImpl } from "../../data/datasources/implementations/local/account/AccountLocalDataSourceImpl";
import { RenterLocalDataSourceImpl } from "../../data/datasources/implementations/local/account/RenterLocalDataSourceImpl";

// ✅ NEW: Vehicle imports
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

    // Register Account services (existing)
    this.services.set(
      "AccountLocalDataSource",
      new AccountLocalDataSourceImpl()
    );
    this.services.set("RenterLocalDataSource", new RenterLocalDataSourceImpl());
    this.services.set(
      "AccountRemoteDataSource",
      new AccountLocalDataSourceImpl()
    );
    this.services.set(
      "RenterRemoteDataSource",
      new RenterLocalDataSourceImpl()
    );

    // ✅ NEW: Register Vehicle services
    // Data Source Layer
    const vehicleRemoteDataSource = new VehicleRemoteDataSourceImpl(axiosClient);
    this.services.set("VehicleRemoteDataSource", vehicleRemoteDataSource);

    // Repository Layer
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

  // ✅ NEW: Type-safe convenience methods
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