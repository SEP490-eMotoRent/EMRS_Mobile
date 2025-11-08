// src/data/repositories/vehicle/VehicleModelRepositoryImpl.ts
import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import { VehicleModelRepository } from "../../../domain/repositories/vehicle/VehicleModelRepository";
import { VehicleModelRemoteDataSource } from "../../datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { CreateVehicleModelRequest } from "../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelResponse } from "../../models/vehicle_model/VehicleModelResponse";
import { VehicleModelSearchResponse } from "../../models/vehicle_model/VehicleModelSearchResponse";

export class VehicleModelRepositoryImpl implements VehicleModelRepository {
    constructor(private remote: VehicleModelRemoteDataSource) {}

    async create(model: VehicleModel): Promise<void> {
        const request: CreateVehicleModelRequest = {
        modelName: model.modelName,
        category: model.category,
        batteryCapacityKwh: model.batteryCapacityKwh,
        maxRangeKm: model.maxRangeKm,
        maxSpeedKmh: model.maxSpeedKmh,
        description: model.description,
        rentalPricingId: model.rentalPricingId
        };
        await this.remote.create(request);
    }

    async delete(model: VehicleModel): Promise<void> {
        throw new Error("Delete not implemented for remote API");
    }

    async getAll(): Promise<VehicleModel[]> {
        const dtos = await this.remote.getAll();
        return dtos.map(dto => this.mapToEntity(dto));
    }

    async getDetail(id: string): Promise<VehicleModel | null> {
        const dto = await this.remote.getDetail(id);
        return dto ? this.mapToEntity(dto) : null;
    }

    async update(model: VehicleModel): Promise<void> {
        throw new Error("Update not implemented for remote API");
    }

    // NEW: Return raw DTOs for UI mapper
    async getAllRaw(): Promise<VehicleModelResponse[]> {
        return this.remote.getAll();
    }

    async search(startTime?: string, endTime?: string, branchId?: string): Promise<VehicleModelSearchResponse[]> {
        return this.remote.search(startTime, endTime, branchId);
    }

    private mapToEntity(dto: VehicleModelResponse): VehicleModel {
        const pricingId = `pricing_${dto.vehicleModelId}`;
        const rentalPricing = new RentalPricing(
        pricingId,
        dto.rentalPrice,
        dto.rentalPrice * 0.1, // excessKmPrice
        []
        );

        return new VehicleModel(
        dto.vehicleModelId,
        dto.modelName || "Unnamed Model",
        dto.category || "Unknown",
        dto.batteryCapacityKwh ?? 0,
        dto.maxRangeKm ?? 0,
        0, // maxSpeedKmh not in this endpoint
        "", // description not in this endpoint
        pricingId,
        rentalPricing,
        new Date(),
        null,
        null,
        false
        );
    }
}