import { Staff } from '../account/Staff';
import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';
import { Vehicle } from '../vehicle/Vehicle';

export class RepairRequest implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public issueDescription: string;
    public priority: string;
    public status: string;
    public approvedAt?: Date;
    public vehicleId: string;
    public staffId: string;

    public vehicle: Vehicle;
    public staff: Staff;

    constructor(
        id: string,
        issueDescription: string,
        priority: string,
        status: string,
        vehicleId: string,
        staffId: string,

        vehicle: Vehicle,
        staff: Staff,

        approvedAt?: Date,
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
        this.issueDescription = issueDescription;
        this.priority = priority;
        this.status = status;
        this.vehicleId = vehicleId;
        this.staffId = staffId;

        // Optional
        this.approvedAt = approvedAt;

        this.vehicle = vehicle;
        this.staff = staff;
    }

    isHighPriority(): boolean {
        return this.priority === 'High';
    }

    isApproved(): boolean {
        return !!this.approvedAt;
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

export type CreateRepairRequestInput = CreateEntityInput<RepairRequest>;
export type UpdateRepairRequestInput = UpdateEntityInput<RepairRequest>;