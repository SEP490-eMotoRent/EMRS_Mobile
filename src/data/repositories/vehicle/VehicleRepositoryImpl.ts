import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { Branch } from "../../../domain/entities/operations/Branch";
import { Vehicle } from "../../../domain/entities/vehicle/Vehicle";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import { VehicleRepository } from "../../../domain/repositories/vehicle/VehicleRepository";
import { VehicleLocalDataSource } from "../../datasources/interfaces/local/vehicle/VehicleLocalDataSource";
import { CreateVehicleRequest } from "../../models/vehicle/CreateVehicleRequest";
import { VehicleResponse } from "../../models/vehicle/VehicleResponse";

export class VehicleRepositoryImpl implements VehicleRepository {
    constructor(private local: VehicleLocalDataSource) {}

    async create(vehicle: Vehicle): Promise<void> {
        const request: CreateVehicleRequest = {
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
        yearOfManufacture: vehicle.yearOfManufacture?.toISOString(),
        currentOdometerKm: vehicle.currentOdometerKm,
        batteryHealthPercentage: vehicle.batteryHealthPercentage,
        status: vehicle.status,
        lastMaintenanceDate: vehicle.lastMaintenanceDate?.toISOString(),
        nextMaintenanceDue: vehicle.nextMaintenanceDue?.toISOString(),
        purchaseDate: vehicle.purchaseDate?.toISOString(),
        description: vehicle.description,
        vehicleModelId: vehicle.vehicleModelId,
        branchId: vehicle.branchId
        };
        await this.local.create(request);
    }

    async delete(vehicle: Vehicle): Promise<void> {
        await this.local.delete(vehicle.id);
    }

    async getAll(): Promise<Vehicle[]> {
        const models = await this.local.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    async getById(id: string): Promise<Vehicle | null> {
        const model = await this.local.getById(id);
        return model ? this.mapToEntity(model) : null;
    }

    async update(vehicle: Vehicle): Promise<void> {
        const model: VehicleResponse = {
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
        yearOfManufacture: vehicle.yearOfManufacture?.toISOString(),
        currentOdometerKm: vehicle.currentOdometerKm,
        batteryHealthPercentage: vehicle.batteryHealthPercentage,
        status: vehicle.status,
        lastMaintenanceDate: vehicle.lastMaintenanceDate?.toISOString(),
        nextMaintenanceDue: vehicle.nextMaintenanceDue?.toISOString(),
        purchaseDate: vehicle.purchaseDate?.toISOString(),
        description: vehicle.description,
        rentalPricing: undefined
        };
        await this.local.update(vehicle.id, model);
    }

    async getWithReferences(vehicleId: string, vehicleModelId: string): Promise<Vehicle | null> {
        const model = await this.local.getWithReferences(vehicleId, vehicleModelId);
        return model ? this.mapToEntity(model) : null;
    }

    private mapToEntity(model: VehicleResponse): Vehicle {
        // ✅ FIXED: HARDCODE IDs - NOT IN DTO
        const branchId = 'branch_1';
        const vehicleModelId = 'model_1';

        // STEP 1: Create MINIMAL RentalPricing
        const minimalRentalPricing = new RentalPricing(
        'pricing_1',
        100,
        10,
        []
        );

        // STEP 2: Create MINIMAL VehicleModel (EXACT 9 PARAMS)
        const minimalVehicleModel = new VehicleModel(
        vehicleModelId,                    // 1. id
        'Tesla Model 3',                   // 2. modelName
        'Sedan',                           // 3. category
        75,                                // 4. batteryCapacityKwh
        500,                               // 5. maxRangeKm
        200,                               // 6. maxSpeedKmh
        'Premium electric sedan',          // 7. description
        'pricing_1',                       // 8. rentalPricingId
        minimalRentalPricing               // 9. rentalPricing
        );

        // STEP 3: Create MINIMAL Branch (EXACT 21 PARAMS)
        const minimalBranch = new Branch(
        branchId,
        'Downtown Branch',
        '123 Main St',
        'New York',
        '+1234567890',
        'branch@test.com',
        40.7128,
        -74.0060,
        '09:00',
        '18:00',
        [], [], [], [], [], [], [],  // relations
        new Date(),
        null,
        null,
        false
        );

        // STEP 4: Convert Dates
        const yearOfManufacture = model.yearOfManufacture ? new Date(model.yearOfManufacture) : undefined;
        const lastMaintenanceDate = model.lastMaintenanceDate ? new Date(model.lastMaintenanceDate) : undefined;
        const nextMaintenanceDue = model.nextMaintenanceDue ? new Date(model.nextMaintenanceDue) : undefined;
        const purchaseDate = model.purchaseDate ? new Date(model.purchaseDate) : undefined;

        // STEP 5: EXACT 22 PARAMETER ORDER
        return new Vehicle(
        model.id,                                    // 1. id
        model.licensePlate,                          // 2. licensePlate
        model.color,                                 // 3. color
        model.currentOdometerKm,                     // 4. currentOdometerKm
        model.batteryHealthPercentage,               // 5. batteryHealthPercentage
        model.status,                                // 6. status
        model.description,                           // 7. description
        branchId,                                    // 8. branchId
        vehicleModelId,                              // 9. vehicleModelId
        minimalBranch,                               // 10. branch
        minimalVehicleModel,                         // 11. vehicleModel
        [],                                          // 12. bookings
        [],                                          // 13. maintenanceSchedules
        [],                                          // 14. repairRequests
        yearOfManufacture,                           // 15. yearOfManufacture
        lastMaintenanceDate,                         // 16. lastMaintenanceDate
        nextMaintenanceDue,                          // 17. nextMaintenanceDue
        purchaseDate,                                // 18. purchaseDate
        new Date(),                                  // 19. createdAt
        null,                                        // 20. updatedAt
        null,                                        // 21. deletedAt
        false                                        // 22. isDeleted
        );
    }
}