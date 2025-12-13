import { useCallback, useEffect, useRef, useState } from 'react';
import sl from '../../../../core/di/InjectionContainer';
import { VehicleModelSearchResponse } from '../../../../data/models/vehicle_model/VehicleModelSearchResponse';
import { ElectricVehicle } from '../ui/molecules/VehicleCard';
import { trackBreadcrumb, trackError } from '../utils/crashTracker';
import { calculateRentalDuration } from '../utils/durationCalculator';
import { mapVehicleModelsToElectricVehicles } from '../utils/vehicleModelMapper';

interface UseVehicleSearchResult {
    vehicles: ElectricVehicle[];
    loading: boolean;
    error: string | null;
    searchVehicles: (
        branchId: string, 
        dateRange: string, 
        startTime?: string, 
        endTime?: string
    ) => Promise<void>;
    cancelSearch: () => void;
}

export const useVehicleSearch = (): UseVehicleSearchResult => {
    const [vehicles, setVehicles] = useState<ElectricVehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const isMountedRef = useRef<boolean>(true);
    const currentSearchIdRef = useRef<number>(0);
    const isSearchingRef = useRef<boolean>(false);

    useEffect(() => {
        return () => {
            trackBreadcrumb('🧹 Cleaning up useVehicleSearch');
            isMountedRef.current = false;
            isSearchingRef.current = false;
        };
    }, []);

    const cancelSearch = useCallback(() => {
        trackBreadcrumb(`⏹️ Cancelling search #${currentSearchIdRef.current}`);
        currentSearchIdRef.current += 1;
        isSearchingRef.current = false;
    }, []);

    const searchVehicles = useCallback(async (
        branchId: string,
        dateRange: string,
        startTime?: string,
        endTime?: string
    ) => {
        // ✅ Validate input
        if (!branchId || typeof branchId !== 'string') {
            trackError('STATE_ERROR', new Error('Invalid branchId'), 'Search validation failed', { branchId });
            if (isMountedRef.current) {
                setError('Invalid branch ID');
                setVehicles([]);
            }
            return;
        }

        // ✅ Prevent concurrent searches
        if (isSearchingRef.current) {
            trackBreadcrumb('🚫 Search already in progress, cancelling...');
            cancelSearch();
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // ✅ Create unique ID for this search
        const searchId = ++currentSearchIdRef.current;
        isSearchingRef.current = true;

        trackBreadcrumb(`🔍 Starting search #${searchId}: branch=${branchId}, range=${dateRange}`);

        try {
            // ✅ Clear state immediately
            if (isMountedRef.current) {
                setLoading(true);
                setError(null);
                setVehicles([]);
            }

            const searchUseCase = sl.getSearchVehiclesUseCase();

            const searchPromise = searchUseCase.execute({
                branchId,
                startTime,
                endTime,
            });

            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Search timeout')), 15000);
            });

            trackBreadcrumb(`⏳ Awaiting API response for search #${searchId}`);

            const results: VehicleModelSearchResponse[] = await Promise.race([
                searchPromise,
                timeoutPromise
            ]);

            // ✅ Check if this search was cancelled
            if (searchId !== currentSearchIdRef.current) {
                trackBreadcrumb(`⏹️ Search #${searchId} was cancelled (current: ${currentSearchIdRef.current})`);
                return;
            }

            // ✅ Check if component unmounted
            if (!isMountedRef.current) {
                trackBreadcrumb(`🗑️ Component unmounted, discarding search #${searchId}`);
                return;
            }

            trackBreadcrumb(`✅ Search #${searchId} completed: ${results?.length || 0} results`);

            if (!Array.isArray(results)) {
                throw new Error('Invalid search results format');
            }

            // ✅ Handle empty results
            if (results.length === 0) {
                trackBreadcrumb(`📭 No vehicles found for search #${searchId}`);
                if (isMountedRef.current && searchId === currentSearchIdRef.current) {
                    setVehicles([]);
                    setLoading(false);
                }
                return;
            }

            // Calculate rental duration
            let rentalDays = 1;
            try {
                rentalDays = calculateRentalDuration(dateRange);
                trackBreadcrumb(`📅 Rental duration: ${rentalDays} days`);
            } catch (durationError) {
                trackError('JS_ERROR', durationError, 'Duration calculation failed', { dateRange });
            }

            // Map results
            const mappedVehicles = mapVehicleModelsToElectricVehicles(results, rentalDays);
            trackBreadcrumb(`🚗 Mapped ${mappedVehicles.length} vehicles`);

            // ✅ Double-check before updating state
            if (isMountedRef.current && searchId === currentSearchIdRef.current) {
                trackBreadcrumb(`✅ Updating state with ${mappedVehicles.length} vehicles`);
                setVehicles(mappedVehicles);
            } else {
                trackBreadcrumb(`⏹️ Discarding results for search #${searchId} (stale)`);
            }

        } catch (err) {
            // ✅ Check if still relevant
            if (!isMountedRef.current || searchId !== currentSearchIdRef.current) {
                trackBreadcrumb(`⏹️ Ignoring error for cancelled/stale search #${searchId}`);
                return;
            }

            const errorMessage = err instanceof Error ? err.message : 'Failed to search vehicles';
            
            trackError('JS_ERROR', err, `Search #${searchId} failed`, {
                branchId,
                dateRange,
                startTime,
                endTime,
                searchId,
                currentSearchId: currentSearchIdRef.current,
            });
            
            if (isMountedRef.current && searchId === currentSearchIdRef.current) {
                setError(errorMessage);
                setVehicles([]);
            }
        } finally {
            // ✅ Only clear loading if this is still the current search
            if (isMountedRef.current && searchId === currentSearchIdRef.current) {
                setLoading(false);
                isSearchingRef.current = false;
                trackBreadcrumb(`🏁 Search #${searchId} finalized`);
            }
        }
    }, [cancelSearch]);

    return {
        vehicles,
        loading,
        error,
        searchVehicles,
        cancelSearch,
    };
};