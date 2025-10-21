import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

// ✅ DIRECT IMPORT
import { VehicleModel } from "../vehicle/VehicleModel";

export class RentalPricing implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public rentalPrice: number;
    public excessKmPrice: number;

    // ✅ 1 RELATION ADDED (LINE 11)
    public vehicleModels: VehicleModel[] = [];

    constructor(
        id: string,
        rentalPrice: number,
        excessKmPrice: number,
        // ✅ RELATION PARAM (LINE 16)
        vehicleModels: VehicleModel[] = [],
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

        this.rentalPrice = rentalPrice;
        this.excessKmPrice = excessKmPrice;

        // ✅ RELATION ASSIGNED (LINE 27)
        this.vehicleModels = vehicleModels;
    }

    calculateTotal(days: number, excessKm: number): number {
        return (this.rentalPrice * days) + (this.excessKmPrice * excessKm);
    }

    // ✅ NEW BUSINESS METHOD
    totalModels(): number {
        return this.vehicleModels.length;
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

export type CreateRentalPricingInput = CreateEntityInput<RentalPricing>;
export type UpdateRentalPricingInput = UpdateEntityInput<RentalPricing>;