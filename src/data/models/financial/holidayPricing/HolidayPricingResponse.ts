export interface HolidayPricingResponse {
    id: string;
    holidayName: string;
    holidayDate: string | null;
    priceMultiplier: number;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
}