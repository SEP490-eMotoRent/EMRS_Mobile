import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

// ✅ DIRECT IMPORT
import { RentalPricing } from "../financial/RentalPricing";

export class VehicleModel implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public modelName: string;
    public category: string;
    public batteryCapacityKwh: number;
    public maxRangeKm: number;
    public maxSpeedKmh: number;
    public description: string;
    public rentalPricingId: string;

    // ✅ 1 RELATION ADDED (LINE 16)
    public rentalPricing: RentalPricing;

    constructor(
        id: string,
        modelName: string,
        category: string,
        batteryCapacityKwh: number,
        maxRangeKm: number,
        maxSpeedKmh: number,
        description: string,
        rentalPricingId: string,
        // ✅ RELATION PARAM (LINE 25)
        rentalPricing: RentalPricing,
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;

        this.modelName = modelName;
        this.category = category;
        this.batteryCapacityKwh = batteryCapacityKwh;
        this.maxRangeKm = maxRangeKm;
        this.maxSpeedKmh = maxSpeedKmh;
        this.description = description;
        this.rentalPricingId = rentalPricingId;

        // ✅ RELATION ASSIGNED (LINE 40)
        this.rentalPricing = rentalPricing;
    }

    fullName(): string {
        return `${this.modelName} (${this.category})`;
    }

    // ✅ NEW BUSINESS METHOD
    dailyRentalPrice(): number {
        return this.rentalPricing.rentalPrice;
    }

    delete(): void {
        this.updatedAt = new Date();
        this.deletedAt = new Date();
        this.isDeleted = true;
    }

    restore(): void {
        this.updatedAt = new Date();
        this.deletedAt = null;
        this.isDeleted = false;
    }
}

export type CreateVehicleModelInput = CreateEntityInput<VehicleModel>;
export type UpdateVehicleModelInput = UpdateEntityInput<VehicleModel>;