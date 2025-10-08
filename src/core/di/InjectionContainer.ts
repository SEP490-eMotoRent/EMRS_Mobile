import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiEndpoints } from '../network/APIEndpoint';
import { ServerException } from '../errors/ServerException';
import { AppLogger } from '../utils/Logger';
import { AccountLocalDataSourceImpl } from '../../data/datasources/local/AccountLocalDataSource';
import { RenterLocalDataSourceImpl } from '../../data/datasources/local/RenterLocalDataSource';
import { AccountRemoteDataSourceImpl } from '../../data/datasources/remote/AccountRemoteDataSource';
import { RenterRemoteDataSourceImpl } from '../../data/datasources/remote/RenterRemoteDataSource';


export class AxiosClient {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
        baseURL: ApiEndpoints.baseUrl,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
        });

        this.axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            AppLogger.getInstance().info(`➡️ [${config.method?.toUpperCase()}] ${config.url}`);
            return config;
        },
        error => {
            AppLogger.getInstance().error(`❌ Request Error: ${error.message}`);
            return Promise.reject(error);
        }
        );

        this.axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            AppLogger.getInstance().info(`✅ Response: ${response.status} ${JSON.stringify(response.data)}`);
            return response;
        },
        error => {
            AppLogger.getInstance().error(`❌ Response Error: ${error.message}`);
            return Promise.reject(error);
        }
        );
    }

    async get<T>(path: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
        try {
        return await this.axiosInstance.get<T>(path, { params });
        } catch (error: any) {
        throw new ServerException(
            error.message || 'Unknown error',
            error.response?.status
        );
        }
    }

    async post<T>(path: string, data?: any): Promise<AxiosResponse<T>> {
        try {
        return await this.axiosInstance.post<T>(path, data);
        } catch (error: any) {
        throw new ServerException(
            error.message || 'Unknown error',
            error.response?.status
        );
        }
    }

    async put<T>(path: string, data?: any): Promise<AxiosResponse<T>> {
        try {
        return await this.axiosInstance.put<T>(path, data);
        } catch (error: any) {
        throw new ServerException(
            error.message || 'Unknown error',
            error.response?.status
        );
        }
    }

    async delete<T>(path: string): Promise<AxiosResponse<T>> {
        try {
        return await this.axiosInstance.delete<T>(path);
        } catch (error: any) {
        throw new ServerException(
            error.message || 'Unknown error',
            error.response?.status
        );
        }
    }
}

class ServiceLocator {
    private static instance: ServiceLocator;
    private services: Map<string, any> = new Map();

    private constructor() {
        // Register services
        this.services.set('AxiosClient', new AxiosClient());
        this.services.set('AppLogger', AppLogger.getInstance());
        this.services.set('AccountLocalDataSource', new AccountLocalDataSourceImpl());
        this.services.set('RenterLocalDataSource', new RenterLocalDataSourceImpl());
        this.services.set('AccountRemoteDataSource', new AccountRemoteDataSourceImpl());
        this.services.set('RenterRemoteDataSource', new RenterRemoteDataSourceImpl());
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
}

// Export singleton instance
const sl = ServiceLocator.getInstance();

export default sl;