import { HolidayPricing } from "../../../domain/entities/financial/HolidayPricing";
import { HolidayPricingRepository } from "../../../domain/repositories/financial/HolidayPricingRepository";
import { HolidayPricingRemoteDataSource } from "../../datasources/interfaces/remote/financial/holidayPricing/HolidayPricingRemoteDataSource";
import { HolidayPricingResponse } from "../../models/financial/holidayPricing/HolidayPricingResponse";

export class HolidayPricingRepositoryImpl implements HolidayPricingRepository {
    private remoteDataSource: HolidayPricingRemoteDataSource;

    constructor(remoteDataSource: HolidayPricingRemoteDataSource) {
        this.remoteDataSource = remoteDataSource;
    }

    private mapToEntity(dto: HolidayPricingResponse): HolidayPricing {
        return new HolidayPricing(
            dto.id,
            dto.holidayName,
            dto.priceMultiplier,
            dto.description,
            dto.isActive,
            dto.holidayDate ? new Date(dto.holidayDate) : null,
            new Date(dto.createdAt),
            dto.updatedAt ? new Date(dto.updatedAt) : null,
            dto.deletedAt ? new Date(dto.deletedAt) : null,
            dto.isDeleted
        );
    }

    async getAll(): Promise<HolidayPricing[]> {
        const response = await this.remoteDataSource.getAll();
        return response.map(this.mapToEntity);
    }

    async getById(id: string): Promise<HolidayPricing> {
        const response = await this.remoteDataSource.getById(id);
        return this.mapToEntity(response);
    }
}