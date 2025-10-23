import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateVehicleRequest } from '../../../../models/vehicle/CreateVehicleRequest';
import { VehicleResponse } from '../../../../models/vehicle/VehicleResponse';
import { VehicleLocalDataSource } from '../../../interfaces/local/vehicle/VehicleLocalDataSource';

export class VehicleLocalDataSourceImpl implements VehicleLocalDataSource {
    private readonly KEY = '@vehicles';

    async create(request: CreateVehicleRequest): Promise<VehicleResponse> {
        const vehicles = await this.getAll();
        const newVehicle: VehicleResponse = { id: `local_${Date.now()}`, ...request };
        vehicles.push(newVehicle);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(vehicles));
        return newVehicle;
    }

    async getAll(): Promise<VehicleResponse[]> {
        try {
        const data = await AsyncStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
        } catch {
        return [];
        }
    }

    async getById(id: string): Promise<VehicleResponse | null> {
        const vehicles = await this.getAll();
        return vehicles.find(v => v.id === id) || null;
    }

    async getWithReferences(vehicleId: string, vehicleModelId: string): Promise<VehicleResponse | null> {
        const vehicle = await this.getById(vehicleId);
        if (vehicle) {
        vehicle.rentalPricing = { id: vehicleModelId, rentalPrice: 100, excessKmPrice: 10 };
        }
        return vehicle;
    }

    // ✅ NEW: update
    async update(id: string, vehicle: VehicleResponse): Promise<void> {
        const vehicles = await this.getAll();
        const index = vehicles.findIndex(v => v.id === id);
        if (index !== -1) {
        vehicles[index] = vehicle;
        await AsyncStorage.setItem(this.KEY, JSON.stringify(vehicles));
        }
    }

    // ✅ NEW: delete
    async delete(id: string): Promise<void> {
        const vehicles = await this.getAll();
        const filtered = vehicles.filter(v => v.id !== id);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(filtered));
    }
}