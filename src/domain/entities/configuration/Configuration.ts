import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";
import { ConfigurationType } from "./ConfigurationType";

/**
 * Configuration Domain Entity
 */
export class Configuration implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public title: string;
    public description: string;
    public type: ConfigurationType;
    public value: string;

    constructor(
        id: string,
        title: string,
        description: string,
        type: ConfigurationType,
        value: string,
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.value = value;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;
    }

    /**
     * Helper method to parse value as number
     */
    getNumericValue(): number {
        return parseFloat(this.value) || 0;
    }

    /**
     * Helper method to check if this is a fee-related configuration
     */
    isFeeConfig(): boolean {
        return [
            ConfigurationType.LateReturnFee,
            ConfigurationType.CleaningFee,
            ConfigurationType.DamageFee,
            ConfigurationType.CrossBranchFee,
            ConfigurationType.ExcessKmFee,
            ConfigurationType.EarlyHandoverFee,
        ].includes(this.type);
    }

    /**
     * Helper method to check if this is a deposit configuration
     */
    isDepositConfig(): boolean {
        return [
            ConfigurationType.EconomyDepositPrice,
            ConfigurationType.StandardDepositPrice,
            ConfigurationType.PremiumDepositPrice,
        ].includes(this.type);
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

export type CreateConfigurationInput = CreateEntityInput<Configuration>;
export type UpdateConfigurationInput = UpdateEntityInput<Configuration>;