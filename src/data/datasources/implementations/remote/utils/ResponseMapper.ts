import { ApiResponse } from "../../../../../core/network/APIResponse";

/**
 * Utility class to map API responses consistently
 * Handles extraction and transformation of response data
 */
export class ResponseMapper {
    /**
     * Maps an Axios response to our ApiResponse format
     * Extracts the data structure and ensures consistency
     */
    static mapApiResponse<T>(response: { data: ApiResponse<T> }): ApiResponse<T> {
        return {
            success: response.data.success,
            message: response.data.message,
            code: response.data.code,
            data: response.data.data
        };
    }

    /**
     * Extracts just the data portion from a response
     * Useful when we only need the payload
     */
    static extractData<T>(response: { data: T }): T {
        return response.data;
    }
}