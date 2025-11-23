import { useCallback, useState, useRef, useEffect } from 'react';
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
    
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const searchVehicles = useCallback(async (
        branchId: string,
        dateRange: string,
        startTime?: string,
        endTime?: string
    ) => {
        if (!branchId || typeof branchId !== 'string') {
            console.error('Invalid branchId:', branchId);
            if (isMountedRef.current) {
                setError('Invalid branch ID');
                setVehicles([]);
            }
            return;
        }

        try {
            if (isMountedRef.current) {
                setLoading(true);
                setError(null);
                setVehicles([]); // ✅ CLEAR OLD VEHICLES IMMEDIATELY
            }

            console.log('🔍 Starting search:', { branchId, dateRange, startTime, endTime });

            const searchUseCase = sl.getSearchVehiclesUseCase();

            const searchPromise = searchUseCase.execute({
                branchId,
                startTime,
                endTime,
            });

            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Search timeout')), 15000);
            });

            const results: VehicleModelSearchResponse[] = await Promise.race([
                searchPromise,
                timeoutPromise
            ]);

            if (!isMountedRef.current) {
                console.log('Component unmounted');
                return;
            }

            console.log('✅ Got results:', results?.length || 0);

            if (!Array.isArray(results)) {
                throw new Error('Invalid search results format');
            }

            // ✅ Handle empty results
            if (results.length === 0) {
                setVehicles([]);
                setLoading(false);
                return;
            }

            let rentalDays = 1;
            try {
                rentalDays = calculateRentalDuration(dateRange);
            } catch (durationError) {
                console.warn('Failed to calculate rental duration:', durationError);
            }

            const mappedVehicles = mapVehicleModelsToElectricVehicles(results, rentalDays);

            if (isMountedRef.current) {
                setVehicles(mappedVehicles);
                console.log('✅ Mapped vehicles:', mappedVehicles.length);
            }

        } catch (err) {
            if (!isMountedRef.current) return;

            const errorMessage = err instanceof Error ? err.message : 'Failed to search vehicles';
            console.error('❌ Search error:', err);
            
            if (isMountedRef.current) {
                setError(errorMessage);
                setVehicles([]); // ✅ CLEAR on error too
            }
        } finally {
            if (isMountedRef.current) {
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