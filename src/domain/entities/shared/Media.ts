import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

export class Media implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public mediaType: string;
    public fileUrl: string;
    public docNo: string;
    public entityType: string;

    constructor(
        id: string,
        mediaType: string,
        fileUrl: string,
        docNo: string,
        entityType: string,
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

        this.mediaType = mediaType;
        this.fileUrl = fileUrl;
        this.docNo = docNo;
        this.entityType = entityType;
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

export type CreateMediaInput = CreateEntityInput<Media>;
export type UpdateMediaInput = UpdateEntityInput<Media>;