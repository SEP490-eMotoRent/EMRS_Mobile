import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

export class HolidayPricing implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public holidayName: string;
    public holidayDate?: Date;
    public priceMultiplier: number;
    public effectiveFrom?: Date;
    public effectiveTo?: Date;
    public description: string;
    public isActive: boolean;

    constructor(
        id: string,
        holidayName: string,
        priceMultiplier: number,
        description: string,
        isActive: boolean,
        holidayDate?: Date,
        effectiveFrom?: Date,
        effectiveTo?: Date,
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

        // Required fields
        this.holidayName = holidayName;
        this.priceMultiplier = priceMultiplier;
        this.description = description;
        this.isActive = isActive;

        // Optional fields
        this.holidayDate = holidayDate;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
    }

    isActiveNow(): boolean {
        if (!this.effectiveFrom || !this.effectiveTo) return this.isActive;
        const now = new Date();
        return this.isActive && now >= this.effectiveFrom && now <= this.effectiveTo;
    }

    applyMultiplier(price: number): number {
        return price * this.priceMultiplier;
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

export type CreateHolidayPricingInput = CreateEntityInput<HolidayPricing>;
export type UpdateHolidayPricingInput = UpdateEntityInput<HolidayPricing>;