import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiEndpoints } from '../network/APIEndpoint';
import { ServerException } from '../errors/ServerException';
import { AppLogger } from '../utils/Logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AxiosClient {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: ApiEndpoints.baseUrl,
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' },
        });

        this.axiosInstance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                console.log('🔍 Interceptor running for:', config.url);
                
                // ✅ Get token from Redux Persist storage
                try {
                    const persistedState = await AsyncStorage.getItem('persist:root');
                    console.log('🔍 Persisted state exists:', !!persistedState);
                    
                    if (persistedState) {
                        const parsedState = JSON.parse(persistedState);
                        console.log('🔍 Parsed state keys:', Object.keys(parsedState));
                        
                        if (parsedState.auth) {
                            const authState = JSON.parse(parsedState.auth);
                            console.log('🔍 Auth state:', authState);
                            const token = authState.token;
                            
                            if (token) {
                                config.headers.Authorization = `Bearer ${token}`;
                                console.log('🔑 Token attached to request');
                                console.log('🔑 Token preview:', token.substring(0, 50) + '...');
                            } else {
                                console.warn('⚠️ No token found in auth state');
                            }
                        } else {
                            console.warn('⚠️ No auth key in persisted state');
                        }
                    } else {
                        console.warn('⚠️ No persisted state found in AsyncStorage');
                    }
                } catch (error) {
                    console.error('❌ Failed to get token:', error);
                }
                
                AppLogger.getInstance().info(`➡️ [${config.method?.toUpperCase()}] ${config.url}`);
                if (config.data) {
                    console.log(`📤 Request Body:`, JSON.stringify(config.data, null, 2));
                }
                console.log('📤 Request Headers:', JSON.stringify(config.headers, null, 2));
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
                console.error('❌ =================================');
                console.error('❌ AXIOS ERROR DETAILS:');
                console.error('❌ =================================');
                console.error('❌ Error Message:', error.message);
                console.error('❌ Error Code:', error.code);
                
                if (error.response) {
                    console.error('❌ Response Status:', error.response.status);
                    console.error('❌ Response Headers:', JSON.stringify(error.response.headers, null, 2));
                    console.error('❌ Response Data:', JSON.stringify(error.response.data, null, 2));
                } else if (error.request) {
                    console.error('❌ No Response Received');
                    console.error('❌ Request:', error.request);
                } else {
                    console.error('❌ Error Config:', error.config);
                }
                console.error('❌ =================================');
                
                AppLogger.getInstance().error(`❌ Response Error: ${error.message}`);
                return Promise.reject(error);
            }
        );
    }

    async get<T>(path: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.get<T>(path, { params });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error
                || error.message 
                || 'Unknown error';
            
            const serverError = new ServerException(
                errorMessage,
                error.response?.status
            );
            
            (serverError as any).responseData = error.response?.data;
            throw serverError;
        }
    }

    async post<T>(path: string, data?: any): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.post<T>(path, data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error
                || error.message 
                || 'Unknown error';
            
            const serverError = new ServerException(
                errorMessage,
                error.response?.status
            );
            
            (serverError as any).responseData = error.response?.data;
            throw serverError;
        }
    }

    async put<T>(path: string, data?: any): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.put<T>(path, data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error
                || error.message 
                || 'Unknown error';
            
            const serverError = new ServerException(
                errorMessage,
                error.response?.status
            );
            
            (serverError as any).responseData = error.response?.data;
            throw serverError;
        }
    }

    async delete<T>(path: string): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.delete<T>(path);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error
                || error.message 
                || 'Unknown error';
            
            const serverError = new ServerException(
                errorMessage,
                error.response?.status
            );
            
            (serverError as any).responseData = error.response?.data;
            throw serverError;
        }
    }
}

class ServiceLocator {
    private static instance: ServiceLocator;
    private services: Map<string, any> = new Map();

    private constructor() {
        this.services.set('AxiosClient', new AxiosClient());
        this.services.set('AppLogger', AppLogger.getInstance());
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

const sl = ServiceLocator.getInstance();
export default sl;