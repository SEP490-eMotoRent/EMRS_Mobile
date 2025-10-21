import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

export class Media implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public mediaName: string;
    public mediaType: string;
    public fileUrl: string;
    public description: string;
    public docNo: string;

    constructor(
        id: string,
        mediaName: string,
        mediaType: string,
        fileUrl: string,
        description: string,
        docNo: string,
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

        this.mediaName = mediaName;
        this.mediaType = mediaType;
        this.fileUrl = fileUrl;
        this.description = description;
        this.docNo = docNo;
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