import { useState, useEffect } from 'react';
import { VehicleModel } from '../../../../domain/entities/vehicle/VehicleModel';
import { VehicleModelResponse } from '../../../../data/models/vehicle_model/VehicleModelResponse';
import { container } from '../../../../core/di/ServiceContainer';
import { GetAllVehicleModelsUseCase } from '../../../../domain/usecases/vehicle/GetAllVehicleModelsUseCase ';

interface UseVehicleModelsResult {
    vehicleModels: VehicleModel[];
    rawDtos: VehicleModelResponse[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useVehicleModels(): UseVehicleModelsResult {
    const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
    const [rawDtos, setRawDtos] = useState<VehicleModelResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicleModels = async () => {
        setLoading(true);
        setError(null);

        try {
            // ✅ UPDATED: Use new container instead of service locator
            const repo = container.vehicle.modelRepository;
            const useCase = new GetAllVehicleModelsUseCase(repo);

            const [models, dtos] = await Promise.all([
                useCase.execute(),
                repo.getAllRaw()
            ]);

            setVehicleModels(models);
            setRawDtos(dtos);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch vehicle models';
            setError(errorMessage);
            console.error('Error fetching vehicle models:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicleModels();
    }, []);

    return {
        vehicleModels,
        rawDtos,
        loading,
        error,
        refetch: fetchVehicleModels
    };
}
