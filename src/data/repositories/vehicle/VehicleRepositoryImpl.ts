import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { Branch } from "../../../domain/entities/operations/Branch";
import { PaginatedVehicleResponse } from "../../../domain/entities/vehicle/PaginatedVehicle";
import { Vehicle } from "../../../domain/entities/vehicle/Vehicle";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import { VehicleRepository } from "../../../domain/repositories/vehicle/VehicleRepository";
import { VehicleRemoteDataSource } from "../../datasources/interfaces/remote/vehicle/VehicleRemoteDataSource";
import { CreateVehicleRequest } from "../../models/vehicle/CreateVehicleRequest";
import { VehicleResponse } from "../../models/vehicle/VehicleResponse";

export class VehicleRepositoryImpl implements VehicleRepository {
    constructor(private remote: VehicleRemoteDataSource) {}

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
        await this.remote.create(request);
    }

    async delete(vehicle: Vehicle): Promise<void> {
        // TODO: Implement when backend DELETE endpoint is available
        throw new Error("Delete endpoint not yet implemented");
    }

    async getAll(): Promise<Vehicle[]> {
        const responses = await this.remote.getAll();
        return responses.map(response => this.mapToEntity(response));
    }

    async getById(id: string): Promise<Vehicle | null> {
        const response = await this.remote.getById(id);
        return response ? this.mapToEntity(response) : null;
    }

    async update(vehicle: Vehicle): Promise<void> {
        // TODO: Implement when backend PUT endpoint is available
        throw new Error("Update endpoint not yet implemented");
    }

    async getWithReferences(vehicleId: string, vehicleModelId: string): Promise<Vehicle | null> {
        const response = await this.remote.getWithReferences(vehicleId, vehicleModelId);
        return response ? this.mapToEntity(response) : null;
    }

    async getVehicles(
        licensePlate: string,
        color: string,
        currentOdometerKm: number,
        batteryHealthPercentage: number,
        status: string,
        pageSize: number,
        pageNum: number
    ): Promise<PaginatedVehicleResponse> {
        const response = await this.remote.getVehicles(
            licensePlate,
            color,
            currentOdometerKm,
            batteryHealthPercentage,
            status,
            pageSize,
            pageNum
        );
        return {
            currentPage: response.currentPage,
            pageSize: response.pageSize,
            totalItems: response.totalItems,
            totalPages: response.totalPages,
            items: response.items.map((item) => this.mapToEntity(item)),
        };
    }

    private mapToEntity(model: VehicleResponse): Vehicle {
        // Create RentalPricing from response if available
        const rentalPricing = model.rentalPricing 
            ? new RentalPricing(
                // model.rentalPricing.id,
                // model.rentalPricing.rentalPrice,
                // model.rentalPricing.excessKmPrice,
                undefined,
                undefined,
                undefined,
                []
              )
            : new RentalPricing('default_pricing', 0, 0, []);

        // Create VehicleModel - using minimal data since backend doesn't return full model
        const vehicleModel = new VehicleModel(
            'model_' + model.id,           // Derive from vehicle ID
            'Unknown Model',               // Backend doesn't return this
            'Unknown',                     // Backend doesn't return this
            0,                             // Backend doesn't return this
            0,                             // Backend doesn't return this
            0,                             // Backend doesn't return this
            model.description,
            rentalPricing.id,
            rentalPricing
        );

        // Create Branch - minimal data since backend doesn't return this
        const branch = new Branch(
            'branch_' + model.id,
            'Unknown Branch',
            'Unknown Address',
            'Unknown City',
            '000-000-0000',
            'branch@example.com',
            0,
            0,
            '09:00',
            '18:00',
            [], [], [], [], [], [], [],
            new Date(),
            null,
            null,
            false
        );

        // Convert date strings to Date objects
        const yearOfManufacture = model.yearOfManufacture 
            ? new Date(model.yearOfManufacture) 
            : undefined;
        const lastMaintenanceDate = model.lastMaintenanceDate 
            ? new Date(model.lastMaintenanceDate) 
            : undefined;
        const nextMaintenanceDue = model.nextMaintenanceDue 
            ? new Date(model.nextMaintenanceDue) 
            : undefined;
        const purchaseDate = model.purchaseDate 
            ? new Date(model.purchaseDate) 
            : undefined;

        // Create Vehicle entity with all required parameters
        return new Vehicle(
            model.id,
            model.licensePlate,
            model.color,
            model.currentOdometerKm,
            model.batteryHealthPercentage,
            model.status,
            model.description,
            branch.id,
            vehicleModel.id,
            model?.rentalPricing,
            branch,
            vehicleModel,
            [],
            [],
            [],
            yearOfManufacture,
            lastMaintenanceDate,
            nextMaintenanceDue,
            model?.fileUrl,
            purchaseDate,
            new Date(),
            null,
            null,
            false
        );
    }
}