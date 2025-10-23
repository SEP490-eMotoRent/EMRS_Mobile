import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateVehicleModelRequest } from '../../../../models/vehicle_model/CreateVehicleModelRequest';
import { VehicleModelResponse } from '../../../../models/vehicle_model/VehicleModelResponse';
import { VehicleModelLocalDataSource } from '../../../interfaces/local/vehicle/VehicleModelLocalDataSource';

export class VehicleModelLocalDataSourceImpl implements VehicleModelLocalDataSource {
    private readonly KEY = '@vehicle_models';

    async create(request: CreateVehicleModelRequest): Promise<VehicleModelResponse> {
        const models = await this.getAll();
        const newModel: VehicleModelResponse = { id: `local_${Date.now()}`, ...request };
        models.push(newModel);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(models));
        return newModel;
    }

    async getAll(): Promise<VehicleModelResponse[]> {
        try {
        const data = await AsyncStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
        } catch {
        return [];
        }
    }

    async getById(id: string): Promise<VehicleModelResponse | null> {
        const models = await this.getAll();
        return models.find(m => m.id === id) || null;
    }

    // ✅ NEW: update
    async update(id: string, model: VehicleModelResponse): Promise<void> {
        const models = await this.getAll();
        const index = models.findIndex(m => m.id === id);
        if (index !== -1) {
        models[index] = model;
        await AsyncStorage.setItem(this.KEY, JSON.stringify(models));
        }
    }

    // ✅ NEW: delete
    async delete(id: string): Promise<void> {
        const models = await this.getAll();
        const filtered = models.filter(m => m.id !== id);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(filtered));
    }
}