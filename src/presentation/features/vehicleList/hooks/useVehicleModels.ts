import { useState, useEffect } from 'react';
import { VehicleModel } from '../../../../domain/entities/vehicle/VehicleModel';
import sl from '../../../../core/di/InjectionContainer';
import { GetAllVehicleModelsUseCase } from '../../../../domain/usecases/vehicle/GetAllVehicleModelsUseCase ';

interface UseVehicleModelsResult {
    vehicleModels: VehicleModel[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom React Native Hook for fetching vehicle models from API
 * Replaces useVehicles to fetch from /Vehicle/model/list endpoint
 * 
 * @example
 * const { vehicleModels, loading, error, refetch } = useVehicleModels();
 */
export function useVehicleModels(): UseVehicleModelsResult {
    const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicleModels = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Get repository from DI container
            const vehicleModelRepo = sl.getVehicleModelRepository();
            
            // Create and execute use case
            const useCase = new GetAllVehicleModelsUseCase(vehicleModelRepo);
            const result = await useCase.execute();
            
            setVehicleModels(result);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch vehicle models';
            setError(errorMessage);
            console.error('❌ Error fetching vehicle models:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicleModels();
    }, []);

    return {
        vehicleModels,
        loading,
        error,
        refetch: fetchVehicleModels
    };
}