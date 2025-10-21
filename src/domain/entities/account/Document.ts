import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";
import { Renter } from "./Renter";

export class Document implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public documentType: string;
    public documentNumber: string;
    public issueDate?: Date;
    public expiryDate?: Date;
    public issuingAuthority?: string;
    public verificationStatus: string;
    public verifiedAt?: Date;
    public renterId: string;

    // ✅ RELATION ADDED HERE (LINE 18)
    public renter: Renter;

    constructor(
        id: string,
        documentType: string,
        documentNumber: string,
        verificationStatus: string,
        renterId: string,
        renter: Renter,        // ✅ ADDED
        issueDate?: Date,
        expiryDate?: Date,
        issuingAuthority?: string,
        verifiedAt?: Date,
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
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.verificationStatus = verificationStatus;
        this.renterId = renterId;

        // Optional fields
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.issuingAuthority = issuingAuthority;
        this.verifiedAt = verifiedAt;

        // ✅ RELATION ASSIGNED (LINE 47)
        this.renter = renter;
    }

    isExpired(): boolean {
        return !!this.expiryDate && new Date() > this.expiryDate;
    }

    isVerified(): boolean {
        return this.verificationStatus === 'Verified';
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

export type CreateDocumentInput = CreateEntityInput<Document>;
export type UpdateDocumentInput = UpdateEntityInput<Document>;