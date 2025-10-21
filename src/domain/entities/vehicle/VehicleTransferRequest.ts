import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';
import { Staff } from "../account/Staff";
import { VehicleTransferOrder } from "./VehicleTransferOrder";

export class VehicleTransferRequest implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public description: string;
    public quantityRequested: number;
    public requestedAt?: Date;
    public status: string;
    public reviewedAt?: Date;
    public vehicleTransferOrderId?: string;
    public staffId: string;

    public staff: Staff;
    public vehicleTransferOrder?: VehicleTransferOrder;

    constructor(
        id: string,
        description: string,
        quantityRequested: number,
        status: string,
        staffId: string,
        staff: Staff,
        vehicleTransferOrder?: VehicleTransferOrder,
        requestedAt?: Date,
        reviewedAt?: Date,
        vehicleTransferOrderId?: string,
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

        this.description = description;
        this.quantityRequested = quantityRequested;
        this.status = status;
        this.staffId = staffId;
        this.requestedAt = requestedAt;
        this.reviewedAt = reviewedAt;
        this.vehicleTransferOrderId = vehicleTransferOrderId;

        this.staff = staff;
        this.vehicleTransferOrder = vehicleTransferOrder;
    }

    isApproved(): boolean { return this.status === 'Approved'; }
    isReviewed(): boolean { return !!this.reviewedAt; }
    staffName(): string { return this.staff.account.fullname || ''; }

    delete(): void { this.updatedAt = new Date(); this.deletedAt = new Date(); this.isDeleted = true; }
    restore(): void { this.updatedAt = new Date(); this.deletedAt = null; this.isDeleted = false; }
}

export type CreateVehicleTransferRequestInput = CreateEntityInput<VehicleTransferRequest>;
export type UpdateVehicleTransferRequestInput = UpdateEntityInput<VehicleTransferRequest>;