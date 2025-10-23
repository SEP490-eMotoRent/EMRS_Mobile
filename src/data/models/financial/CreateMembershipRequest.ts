export interface CreateMembershipRequest {
    tierName: string;
    minBookings: number;
    discountPercentage: number;
    freeChargingPerMonth: number;
    description: string;
}