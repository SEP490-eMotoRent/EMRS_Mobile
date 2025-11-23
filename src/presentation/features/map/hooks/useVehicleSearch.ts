import { useCallback, useState, useRef } from 'react';
import sl from '../../../../core/di/InjectionContainer';
import { VehicleModelSearchResponse } from '../../../../data/models/vehicle_model/VehicleModelSearchResponse';
import { ElectricVehicle } from '../ui/molecules/VehicleCard';
import { calculateRentalDuration } from '../utils/durationCalculator';
import { mapVehicleModelsToElectricVehicles } from '../utils/vehicleModelMapper';

interface UseVehicleSearchResult {
    vehicles: ElectricVehicle[];
    loading: boolean;
    error: string | null;
    searchVehicles: (branchId: string, dateRange: string, startTime?: string, endTime?: string) => Promise<void>;
}

export const useVehicleSearch = (): UseVehicleSearchResult => {
    const [vehicles, setVehicles] = useState<ElectricVehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // ✅ Track component mount state
    const isMountedRef = useRef<boolean>(true);
    
    // ✅ Track current search request
    const currentSearchRef = useRef<string | null>(null);

    // ✅ Cleanup on unmount
    useState(() => {
        return () => {
            isMountedRef.current = false;
        };
    });

    const searchVehicles = useCallback(async (
        branchId: string,
        dateRange: string,
        startTime?: string,
        endTime?: string
    ) => {
        // ✅ Validate inputs
        if (!branchId || typeof branchId !== 'string') {
            console.error('Invalid branchId:', branchId);
            if (isMountedRef.current) {
                setError('Invalid branch ID');
                setVehicles([]);
            }
            return;
        }

        // ✅ Generate unique search ID
        const searchId = `${branchId}-${Date.now()}`;
        currentSearchRef.current = searchId;

        try {
            if (isMountedRef.current) {
                setLoading(true);
                setError(null);
            }

            console.log('🔍 useVehicleSearch - Starting search:', { 
                branchId, 
                dateRange,
                startTime,
                endTime 
            });

            // ✅ Get use case safely
            let searchUseCase;
            try {
                searchUseCase = sl.getSearchVehiclesUseCase();
            } catch (err) {
                throw new Error('Failed to initialize search use case');
            }

            // ✅ Execute search with timeout protection
            const searchPromise = searchUseCase.execute({
                branchId,
                startTime,
                endTime,
            });

            // ✅ Add timeout (15 seconds)
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Search timeout')), 15000);
            });

            const results: VehicleModelSearchResponse[] = await Promise.race([
                searchPromise,
                timeoutPromise
            ]);

            // ✅ Check if this search is still relevant (not cancelled)
            if (currentSearchRef.current !== searchId || !isMountedRef.current) {
                console.log('Search cancelled or component unmounted');
                return;
            }

            console.log('✅ useVehicleSearch - Got results:', results?.length || 0);

            // ✅ Validate results
            if (!Array.isArray(results)) {
                throw new Error('Invalid search results format');
            }

            // ✅ Calculate rental duration safely
            let rentalDays = 1; // Default fallback
            try {
                rentalDays = calculateRentalDuration(dateRange);
                console.log('🔍 useVehicleSearch - rentalDays:', rentalDays);
            } catch (durationError) {
                console.warn('Failed to calculate rental duration:', durationError);
            }

            // ✅ Map to UI models safely
            let mappedVehicles: ElectricVehicle[] = [];
            try {
                mappedVehicles = mapVehicleModelsToElectricVehicles(results, rentalDays);
            } catch (mapError) {
                console.error('Failed to map vehicles:', mapError);
                throw new Error('Failed to process vehicle data');
            }

            // ✅ Validate mapped vehicles
            if (!Array.isArray(mappedVehicles)) {
                throw new Error('Invalid mapped vehicles format');
            }

            if (isMountedRef.current && currentSearchRef.current === searchId) {
                setVehicles(mappedVehicles);
                console.log('✅ useVehicleSearch - Mapped vehicles:', mappedVehicles.length);
            }

        } catch (err) {
            // ✅ Only update state if this search is still relevant
            if (currentSearchRef.current !== searchId || !isMountedRef.current) {
                return;
            }

            const errorMessage = err instanceof Error ? err.message : 'Failed to search vehicles';
            console.error('❌ useVehicleSearch error:', err);
            
            if (isMountedRef.current) {
                setError(errorMessage);
                setVehicles([]);
            }
        } finally {
            if (isMountedRef.current && currentSearchRef.current === searchId) {
                setLoading(false);
            }
        }
    }, []);

    return {
        vehicles,
        loading,
        error,
        searchVehicles,
    };
};