import { useState, useEffect } from 'react';
import { Vehicle } from '../../../../domain/entities/vehicle/Vehicle';
import { GetAllVehiclesUseCase } from '../../../../domain/usecases/vehicle/GetAllVehicleUseCase';
import { container } from '../../../../core/di/ServiceContainer'; // ✅ NEW

interface UseVehiclesResult {
    vehicles: Vehicle[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom React Native Hook for fetching vehicles from API
 * 
 * @example
 * const { vehicles, loading, error, refetch } = useVehicles();
 */
export function useVehicles(): UseVehiclesResult {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicles = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const vehicleRepo = container.vehicle.repository;
            
            // Create and execute use case
            const useCase = new GetAllVehiclesUseCase(vehicleRepo);
            const result = await useCase.execute();
            
            setVehicles(result);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch vehicles';
            setError(errorMessage);
            console.error('❌ Error fetching vehicles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return {
        vehicles,
        loading,
        error,
        refetch: fetchVehicles
    };
}