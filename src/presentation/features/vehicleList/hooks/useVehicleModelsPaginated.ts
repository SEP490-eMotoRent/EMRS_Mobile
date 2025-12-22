import { useState, useCallback } from 'react';
import { VehicleModelSearchItem } from '../../../../data/models/vehicle_model/VehicleModelPaginatedSearchResponse';
import { container } from '../../../../core/di/ServiceContainer';

interface UseVehicleModelsPaginatedResult {
    items: VehicleModelSearchItem[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    loadInitial: (params?: SearchParams) => Promise<void>;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
}

interface SearchParams {
    startTime?: string;
    endTime?: string;
    branchId?: string;
}

const PAGE_SIZE = 10; // Number of items per page
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

/**
 * Helper function to check if error is transient (network/timeout/server error)
 */
const isTransientError = (err: any): boolean => {
    return (
        err instanceof TypeError || // Network errors
        err?.message?.toLowerCase().includes('timeout') ||
        err?.message?.toLowerCase().includes('network') ||
        err?.message?.toLowerCase().includes('transient') ||
        err?.response?.status >= 500 // Server errors
    );
};

/**
 * Helper function to retry async operations with exponential backoff
 */
const retryWithBackoff = async <T,>(
    operation: () => Promise<T>,
    operationName: string,
    retryCount = 0
): Promise<T> => {
    try {
        return await operation();
    } catch (err) {
        if (isTransientError(err) && retryCount < MAX_RETRIES) {
            const delay = RETRY_DELAY * Math.pow(2, retryCount);
            // console.log(`🔄 [RETRY] ${operationName} - Thử lại lần ${retryCount + 1}/${MAX_RETRIES} sau ${delay}ms`);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryWithBackoff(operation, operationName, retryCount + 1);
        }
        throw err; // Re-throw if not transient or max retries exceeded
    }
};

export function useVehicleModelsPaginated(): UseVehicleModelsPaginatedResult {
    const [items, setItems] = useState<VehicleModelSearchItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchParams, setSearchParams] = useState<SearchParams>({});

    const hasMore = currentPage < totalPages;

    /**
     * Load initial page (page 1) with retry logic
     */
    const loadInitial = useCallback(async (params: SearchParams = {}) => {
        setLoading(true);
        setError(null);
        setSearchParams(params);

        try {
            // console.log("🔄 [PAGINATED HOOK] Loading initial page...");
            
            const response = await retryWithBackoff(
                async () => {
                    const dataSource = container.vehicle.modelRepository;
                    return await dataSource.searchPaginated(
                        1, // First page
                        PAGE_SIZE,
                        params.startTime,
                        params.endTime,
                        params.branchId
                    );
                },
                'Load Initial'
            );

            setItems(response.items);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);

            // console.log(` [PAGINATED HOOK] Loaded ${response.items.length} items (Page 1/${response.totalPages})`);
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể tải dữ liệu xe';
            setError(errorMessage);
            console.error('❌ [PAGINATED HOOK] Error loading initial:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Load next page and append to existing items with retry logic
     */
    const loadMore = useCallback(async () => {
        if (!hasMore || loadingMore || loading) {
            // console.log("⏭️ [PAGINATED HOOK] Skip load more:", { hasMore, loadingMore, loading });
            return;
        }

        setLoadingMore(true);
        setError(null);

        try {
            const nextPage = currentPage + 1;
            // console.log(`🔄 [PAGINATED HOOK] Loading page ${nextPage}...`);
            
            const response = await retryWithBackoff(
                async () => {
                    const dataSource = container.vehicle.modelRepository;
                    return await dataSource.searchPaginated(
                        nextPage,
                        PAGE_SIZE,
                        searchParams.startTime,
                        searchParams.endTime,
                        searchParams.branchId
                    );
                },
                `Load More (Page ${nextPage})`
            );

            // ✅ Append new items to existing list
            setItems(prev => [...prev, ...response.items]);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);

            // console.log(`✅ [PAGINATED HOOK] Loaded ${response.items.length} more items (Page ${nextPage}/${response.totalPages})`);
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể tải thêm xe';
            setError(errorMessage);
            console.error('❌ [PAGINATED HOOK] Error loading more:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [currentPage, totalPages, searchParams, hasMore, loadingMore, loading]);

    /**
     * Refresh - reload from page 1
     */
    const refresh = useCallback(async () => {
        // console.log("🔄 [PAGINATED HOOK] Refreshing...");
        await loadInitial(searchParams);
    }, [loadInitial, searchParams]);

    return {
        items,
        loading,
        loadingMore,
        error,
        hasMore,
        currentPage,
        totalPages,
        totalItems,
        loadInitial,
        loadMore,
        refresh,
    };
}