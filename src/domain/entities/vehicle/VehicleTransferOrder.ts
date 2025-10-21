import { Branch } from '../operations/Branch';
import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';
import { VehicleTransferRequest } from "./VehicleTransferRequest";

export class VehicleTransferOrder implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public status: string;
    public receivedDate?: Date;
    public notes: string;
    public fromBranchId: string;
    public toBranchId: string;

    public fromBranch: Branch;
    public toBranch: Branch;
    public transferRequest: VehicleTransferRequest;

    constructor(
        id: string,
        status: string,
        notes: string,
        fromBranchId: string,
        toBranchId: string,
        fromBranch: Branch,
        toBranch: Branch,
        transferRequest: VehicleTransferRequest,
        receivedDate?: Date,
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

        this.status = status;
        this.notes = notes;
        this.fromBranchId = fromBranchId;
        this.toBranchId = toBranchId;
        this.receivedDate = receivedDate;

        this.fromBranch = fromBranch;
        this.toBranch = toBranch;
        this.transferRequest = transferRequest;
    }

    isCompleted(): boolean { return this.status === 'Completed'; }
    isReceived(): boolean { return !!this.receivedDate; }
    fromBranchName(): string { return this.fromBranch.branchName; }
    toBranchName(): string { return this.toBranch.branchName; }

    delete(): void { this.updatedAt = new Date(); this.deletedAt = new Date(); this.isDeleted = true; }
    restore(): void { this.updatedAt = new Date(); this.deletedAt = null; this.isDeleted = false; }
}

export type CreateVehicleTransferOrderInput = CreateEntityInput<VehicleTransferOrder>;
export type UpdateVehicleTransferOrderInput = UpdateEntityInput<VehicleTransferOrder>;