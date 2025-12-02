export interface DamageType {
    damageType: string;
    description: string;
    minAmount: number;
    maxAmount: number;
    displayText: string;
}

export interface DamageTypesResponse {
    options: DamageType[];
}