export interface AddFeeDamageRequest {
    bookingId: string;
    damageType: string;
    amount: number;
    additionalNotes: string;
}