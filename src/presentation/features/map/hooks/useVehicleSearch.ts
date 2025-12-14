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
            console.log('[useVehicleSearch] Unmounting hook');
            trackBreadcrumb('🧹 Cleaning up useVehicleSearch');
            isMountedRef.current = false;
            isSearchingRef.current = false;
        };
    }, []);

    const cancelSearch = useCallback(() => {
        console.log('[useVehicleSearch] Cancelling search #', currentSearchIdRef.current);
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
        if (!branchId || typeof branchId !== 'string') {
            console.error('[useVehicleSearch] Invalid branch ID: ', branchId);
            trackError('STATE_ERROR', new Error('Invalid branchId'), 'Search validation failed', { branchId });
            if (isMountedRef.current) {
                setError('Invalid branch ID');
                setVehicles([]);
            }
            return;
        }

        if (isSearchingRef.current) {
            console.log('[useVehicleSearch] Search in progress, cancelling old one');
            trackBreadcrumb('🚫 Search already in progress, cancelling...');
            cancelSearch();
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        const searchId = ++currentSearchIdRef.current;
        isSearchingRef.current = true;

        console.log('[useVehicleSearch] Starting search #', searchId, ': branch=', branchId, ', range=', dateRange);
        trackBreadcrumb(`🔍 Starting search #${searchId}: branch=${branchId}, range=${dateRange}`);

        try {
            // Set loading, but DO NOT clear vehicles — prevent flash/crash on rapid taps
            if (isMountedRef.current) {
                setLoading(true);
                setError(null);
                // REMOVED setVehicles([]) — keeps old vehicles until new ones load, cures unmount race
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

            console.log('[useVehicleSearch] Awaiting API for search #', searchId);
            trackBreadcrumb(`⏳ Awaiting API response for search #${searchId}`);

            const results: VehicleModelSearchResponse[] = await Promise.race([
                searchPromise,
                timeoutPromise
            ]);

            if (searchId !== currentSearchIdRef.current) {
                console.log('[useVehicleSearch] Search #', searchId, ' cancelled');
                trackBreadcrumb(`⏹️ Search #${searchId} was cancelled (current: ${currentSearchIdRef.current})`);
                return;
            }

            if (!isMountedRef.current) {
                console.log('[useVehicleSearch] Component unmounted, discarding search #', searchId);
                trackBreadcrumb(`🗑️ Component unmounted, discarding search #${searchId}`);
                return;
            }

            console.log('[useVehicleSearch] Search #', searchId, ' completed with ', results?.length || 0, ' results');
            trackBreadcrumb(`✅ Search #${searchId} completed: ${results?.length || 0} results`);

            if (!Array.isArray(results)) {
                throw new Error('Invalid search results format');
            }

            if (results.length === 0) {
                console.log('[useVehicleSearch] No vehicles found for search #', searchId);
                trackBreadcrumb(`📭 No vehicles found for search #${searchId}`);
                if (isMountedRef.current && searchId === currentSearchIdRef.current) {
                    setVehicles([]);
                    setLoading(false);
                }
                return;
            }

            let rentalDays = 1;
            try {
                rentalDays = calculateRentalDuration(dateRange);
                console.log('[useVehicleSearch] Rental duration: ', rentalDays, ' days');
                trackBreadcrumb(`📅 Rental duration: ${rentalDays} days`);
            } catch (durationError) {
                console.error('[useVehicleSearch] Duration calculation failed: ', durationError);
                trackError('JS_ERROR', durationError, 'Duration calculation failed', { dateRange });
            }

            const mappedVehicles = mapVehicleModelsToElectricVehicles(results, rentalDays);
            console.log('[useVehicleSearch] Mapped ', mappedVehicles.length, ' vehicles');
            trackBreadcrumb(`🚗 Mapped ${mappedVehicles.length} vehicles`);

            if (isMountedRef.current && searchId === currentSearchIdRef.current) {
                console.log('[useVehicleSearch] Updating state with ', mappedVehicles.length, ' vehicles');
                trackBreadcrumb(`✅ Updating state with ${mappedVehicles.length} vehicles`);
                setVehicles(mappedVehicles);
            } else {
                console.log('[useVehicleSearch] Discarding results for stale search #', searchId);
                trackBreadcrumb(`⏹️ Discarding results for search #${searchId} (stale)`);
            }

        } catch (err) {
            if (!isMountedRef.current || searchId !== currentSearchIdRef.current) {
                console.log('[useVehicleSearch] Ignoring error for cancelled/stale search #', searchId);
                trackBreadcrumb(`⏹️ Ignoring error for cancelled/stale search #${searchId}`);
                return;
            }

            const errorMessage = err instanceof Error ? err.message : 'Failed to search vehicles';
            
            console.error('[useVehicleSearch] Search #', searchId, ' failed: ', errorMessage);
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
            if (isMountedRef.current && searchId === currentSearchIdRef.current) {
                setLoading(false);
                isSearchingRef.current = false;
                console.log('[useVehicleSearch] Search #', searchId, ' finalized');
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