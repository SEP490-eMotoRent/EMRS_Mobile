import { useCallback, useState } from 'react';
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

const searchVehicles = useCallback(async (
    branchId: string,
    dateRange: string,
    startTime?: string,
    endTime?: string
) => {
    try {
        setLoading(true);
        setError(null);

        console.log('🔍 useVehicleSearch - dateRange input:', dateRange);

        const searchUseCase = sl.getSearchVehiclesUseCase();
        const results: VehicleModelSearchResponse[] = await searchUseCase.execute({
            branchId,
            startTime,
            endTime,
        });

        // Calculate rental duration from dateRange
        const rentalDays = calculateRentalDuration(dateRange);
        console.log('🔍 useVehicleSearch - rentalDays calculated:', rentalDays);

        // Map API response to UI model with rental duration
        const mappedVehicles = mapVehicleModelsToElectricVehicles(results, rentalDays);
        setVehicles(mappedVehicles);
    } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to search vehicles';
            setError(errorMessage);
            console.error('Error searching vehicles:', err);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        vehicles,
        loading,
        error,
        searchVehicles,
    };
};