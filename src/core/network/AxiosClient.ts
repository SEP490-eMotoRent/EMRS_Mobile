import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "../../presentation/features/authentication/store";
import { ServerException } from "../errors/ServerException";
import { ApiEndpoints } from "../network/APIEndpoint";
import { AppLogger } from "../utils/Logger";

export class AxiosClient {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: ApiEndpoints.baseUrl,
      headers: { "Content-Type": "application/json" },
    });

    /* ------------------- REQUEST INTERCEPTOR ------------------- */
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = store.getState().auth.token;
        console.log("Interceptor running for:", config.url);

        const fullUrl = `${config.baseURL || ""}${config.url}`;
        console.log("➡️ Request URL:", fullUrl);

        if (config.params) {
          console.log(
            "🧭 Query Params:",
            JSON.stringify(config.params, null, 2)
          );
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("Token attached to request");
        } else {
          console.warn("No token found in auth state");
        }

        // Let Axios set the multipart boundary automatically
        if (config.data instanceof FormData) {
          // DO NOT delete Content-Type
          // Axios will set: multipart/form-data; boundary=...
          // @ts-ignore
          for (const [key, value] of config.data._parts) {
            // If value is a File/Blob, you can log name & type
            if (value && typeof value === "object" && "uri" in value) {
              // React Native file object from Expo/ImagePicker
              console.log(
                `${key}: File { uri: ${value.uri}, name: ${value.name}, type: ${value.type} }`
              );
            } else {
              console.log(`${key}:`, value);
            }
          }
          config.headers["Content-Type"] = "multipart/form-data";

          console.log("Request data:", config.data);
        }

        AppLogger.getInstance().info(
          `[${config.method?.toUpperCase()}] ${config.url}`
        );

        if (config.data && !(config.data instanceof FormData)) {
          console.log(`Request Body:`, JSON.stringify(config.data, null, 2));
        }

        console.log(
          "Request Headers:",
          JSON.stringify(config.headers, null, 2)
        );
        return config;
      },
      (error) => {
        AppLogger.getInstance().error(`Request Error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    /* ------------------- RESPONSE INTERCEPTOR ------------------- */
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        AppLogger.getInstance().info(
          `Response: ${response.status} ${JSON.stringify(response.data)}`
        );
        return response;
      },
      (error) => {
        if (error.response) {
          console.log("Response error:", error.response.data);
        } else if (error.request) {
          console.log("Request error:", error.request);
        }
        return Promise.reject(error);
      }
    );
  }

  /* ------------------- PUBLIC METHODS ------------------- */

  /**
   * Get the current authentication token from Redux store
   */
  public getAuthToken(): string | null {
    return store.getState().auth.token;
  }

  async get<T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this._handle<T>(this.axiosInstance.get<T>(path, config));
  }

  async post<T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this._handle<T>(this.axiosInstance.post<T>(path, data, config));
  }

  async put<T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this._handle<T>(this.axiosInstance.put<T>(path, data, config));
  }

  async delete<T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this._handle<T>(this.axiosInstance.delete<T>(path, config));
  }

  /* ------------------- PRIVATE HELPER ------------------- */
  private async _handle<T>(
    promise: Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    try {
      return await promise;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.message ??
        "Unknown error";

      const serverError = new ServerException(msg, error.response?.status);
      (serverError as any).responseData = error.response?.data;
      throw serverError;
    }
  }
}

/* ------------------- SERVICE LOCATOR (unchanged) ------------------- */
class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.services.set("AxiosClient", new AxiosClient());
    this.services.set("AppLogger", AppLogger.getInstance());
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
