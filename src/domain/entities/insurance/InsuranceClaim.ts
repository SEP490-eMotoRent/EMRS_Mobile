import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

export class InsuranceClaim implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public incidentDate: Date | null;
    public incidentLocation: string;
    public description: string;
    public severity: string;
    public status: string;
    public vehicleDamageCost: number;
    public personInjuryCost: number;
    public thirdPartyCost: number;
    public totalCost: number;
    public insuranceCoverageAmount: number;
    public renterLiabilityAmount: number;
    public reviewedDate: Date | null;
    public completedAt: Date | null;
    public rejectionReason: string;
    public insuranceClaimPdfUrl: string | null;
    public notes: string;
    public renterId: string;
    public bookingId: string;

    constructor(
        id: string,
        incidentLocation: string,
        description: string,
        severity: string,
        status: string,
        vehicleDamageCost: number,
        personInjuryCost: number,
        thirdPartyCost: number,
        totalCost: number,
        insuranceCoverageAmount: number,
        renterLiabilityAmount: number,
        rejectionReason: string,
        notes: string,
        renterId: string,
        bookingId: string,
        incidentDate: Date | null = null,
        reviewedDate: Date | null = null,
        completedAt: Date | null = null,
        insuranceClaimPdfUrl: string | null = null,
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
        this.incidentLocation = incidentLocation;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.vehicleDamageCost = vehicleDamageCost;
        this.personInjuryCost = personInjuryCost;
        this.thirdPartyCost = thirdPartyCost;
        this.totalCost = totalCost;
        this.insuranceCoverageAmount = insuranceCoverageAmount;
        this.renterLiabilityAmount = renterLiabilityAmount;
        this.rejectionReason = rejectionReason;
        this.notes = notes;
        this.renterId = renterId;
        this.bookingId = bookingId;

        this.incidentDate = incidentDate;
        this.reviewedDate = reviewedDate;
        this.completedAt = completedAt;
        this.insuranceClaimPdfUrl = insuranceClaimPdfUrl;
    }

    isApproved(): boolean {
        return this.status === 'Approved';
    }

    totalRenterCost(): number {
        return this.renterLiabilityAmount;
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

export type CreateInsuranceClaimInput = CreateEntityInput<InsuranceClaim>;
export type UpdateInsuranceClaimInput = UpdateEntityInput<InsuranceClaim>;