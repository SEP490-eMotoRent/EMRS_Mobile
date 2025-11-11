// src/data/repositories/vehicle/VehicleModelRepositoryImpl.ts
import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import { VehicleModelRepository } from "../../../domain/repositories/vehicle/VehicleModelRepository";
import { VehicleModelRemoteDataSource } from "../../datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { CreateVehicleModelRequest } from "../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelResponse } from "../../models/vehicle_model/VehicleModelResponse";
import { VehicleModelDetailResponse } from "../../models/vehicle_model/VehicleModelDetailResponse";
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
        return dtos.map(dto => this.mapListToEntity(dto));
    }

    async getDetail(id: string): Promise<VehicleModel | null> {
        const dto = await this.remote.getDetail(id);
        return dto ? this.mapDetailToEntity(dto) : null;
    }

    async update(model: VehicleModel): Promise<void> {
        throw new Error("Update not implemented for remote API");
    }

    async getAllRaw(): Promise<VehicleModelResponse[]> {
        return this.remote.getAll();
    }

    async search(startTime?: string, endTime?: string, branchId?: string): Promise<VehicleModelSearchResponse[]> {
        return this.remote.search(startTime, endTime, branchId);
    }

    // Map LIST API response (VehicleModelResponse) to entity
    private mapListToEntity(dto: VehicleModelResponse): VehicleModel {
        const pricingId = `pricing_${dto.vehicleModelId}`;
        const rentalPricing = new RentalPricing(
            pricingId,
            dto.rentalPrice, // Flat rentalPrice from list API
            dto.rentalPrice * 0.1, // excessKmPrice estimate
            []
        );

        return new VehicleModel(
            dto.vehicleModelId,
            dto.modelName || "Unnamed Model",
            dto.category || "Unknown",
            dto.batteryCapacityKwh ?? 0,
            dto.maxRangeKm ?? 0,
            0, // maxSpeedKmh not in list endpoint
            "", // description not in list endpoint
            pricingId,
            rentalPricing,
            new Date(),
            null,
            null,
            false
        );
    }

    // Map DETAIL API response (VehicleModelDetailResponse) to entity
    private mapDetailToEntity(dto: VehicleModelDetailResponse): VehicleModel {
        const pricingId = dto.rentalPricing.id;
        const rentalPricing = new RentalPricing(
            pricingId,
            dto.rentalPricing.rentalPrice, // Nested rentalPrice from detail API
            dto.rentalPricing.excessKmPrice,
            []
        );

        return new VehicleModel(
            dto.vehicleModelId,
            dto.modelName || "Unnamed Model",
            dto.category || "Unknown",
            dto.batteryCapacityKwh ?? 0,
            dto.maxRangeKm ?? 0,
            dto.maxSpeedKmh ?? 0,
            dto.description || "",
            pricingId,
            rentalPricing,
            new Date(),
            null,
            null,
            false
        );
    }
}