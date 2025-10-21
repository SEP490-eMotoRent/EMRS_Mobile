import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

export class Configuration implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public title: string;
    public description: string;
    public value1: string;
    public value2: string;

    constructor(
        id: string,
        title: string,
        description: string,
        value1: string,
        value2: string,
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

        this.title = title;
        this.description = description;
        this.value1 = value1;
        this.value2 = value2;
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