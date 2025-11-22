import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

export class HolidayPricing implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public holidayName: string;
    public holidayDate: Date | null;
    public priceMultiplier: number;
    public description: string;
    public isActive: boolean;

    constructor(
        id: string,
        holidayName: string,
        priceMultiplier: number,
        description: string,
        isActive: boolean,
        holidayDate: Date | null = null,
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

        this.holidayName = holidayName;
        this.holidayDate = holidayDate;
        this.priceMultiplier = priceMultiplier;
        this.description = description;
        this.isActive = isActive;
    }

    /**
     * Check if a given date falls on this holiday
     */
    isDateOnHoliday(date: Date): boolean {
        if (!this.holidayDate || !this.isActive) return false;
        
        const holidayDateOnly = new Date(this.holidayDate);
        holidayDateOnly.setHours(0, 0, 0, 0);
        
        const checkDateOnly = new Date(date);
        checkDateOnly.setHours(0, 0, 0, 0);
        
        return holidayDateOnly.getTime() === checkDateOnly.getTime();
    }

    /**
     * Apply price multiplier to base price
     */
    applyMultiplier(basePrice: number): number {
        return basePrice * this.priceMultiplier;
    }

    /**
     * Calculate surcharge amount
     */
    getSurchargeAmount(basePrice: number): number {
        return basePrice * (this.priceMultiplier - 1);
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