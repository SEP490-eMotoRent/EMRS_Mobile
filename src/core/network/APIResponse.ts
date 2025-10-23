/**
 * Standard API response wrapper from backend
 * Matches C# ResultResponse<T> structure
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    code: number;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
    return response.success && response.code >= 200 && response.code < 300;
}

/**
 * Extract data from API response or throw error
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T {
    if (!isSuccessResponse(response)) {
        throw new Error(response.message || 'API request failed');
    }
    return response.data;
}