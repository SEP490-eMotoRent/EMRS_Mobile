import { ServerException } from "../../../../../core/errors/ServerException";
import { AppLogger } from "../../../../../core/utils/Logger";

/**
 * Utility class to wrap API calls with consistent error handling and logging
 * Eliminates repetitive try-catch blocks and logging patterns
 */
export class ApiCallWrapper {
    private readonly logger = AppLogger.getInstance();

    /**
     * Wraps an API call with error handling and logging
     * @param operation Name of the operation (for logging)
     * @param apiCall The actual API call function
     * @param defaultErrorMessage Fallback error message
     * @param defaultErrorCode Fallback error code
     */
    async execute<T>(
        operation: string,
        apiCall: () => Promise<T>,
        defaultErrorMessage: string,
        defaultErrorCode: number = 500
    ): Promise<T> {
        try {
            this.logger.info(`🔄 ${operation}...`);
            
            const result = await apiCall();
            
            this.logger.info(`✅ ${operation} successful`);
            
            return result;
        } catch (error: any) {
            this.logger.error(`❌ ${operation} failed: ${error.message}`);
            
            // If already a ServerException from interceptor, re-throw it
            if (error instanceof ServerException) {
                throw error;
            }
            
            // Otherwise, wrap it in a ServerException
            throw new ServerException(
                error.response?.data?.message || defaultErrorMessage,
                error.response?.status || defaultErrorCode
            );
        }
    }
}