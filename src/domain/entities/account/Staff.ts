import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

import { Account } from "./Account";
import { MaintenanceRecord } from "../maintenance/MaintenanceRecord";
import { MaintenanceSchedule } from "../maintenance/MaintenanceSchedule";
import { RentalReceipt } from "../booking/RentalReceipt";
import { RepairRequest } from "../maintenance/RepairRequest";
import { VehicleTransferRequest } from "../vehicle/VehicleTransferRequest";
import { Branch } from "../operations/Branch";
import { ChargingRecord } from "../operations/ChargingRecord";
import { Ticket } from "./Ticket";

export class Staff implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public accountId: string;
    public branchId?: string;

    // ✅ RELATIONS ADDED HERE (LINE 22-30)
    public account: Account;
    public branch?: Branch;
    public maintenanceRecords: MaintenanceRecord[] = [];
    public maintenanceSchedules: MaintenanceSchedule[] = [];
    public rentalReceipts: RentalReceipt[] = [];
    public repairRequests: RepairRequest[] = [];
    public vehicleTransferRequests: VehicleTransferRequest[] = [];
    public chargingRecords: ChargingRecord[] = [];
    public tickets: Ticket[] = [];

    constructor(
        id: string,
        accountId: string,
        account: Account,           // ✅ ADDED
        branchId?: string,
        branch?: Branch,           // ✅ ADDED
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
        this.accountId = accountId;

        // Optional fields
        this.branchId = branchId;

        // ✅ RELATIONS ASSIGNED (LINE 46-47)
        this.account = account;
        this.branch = branch;
    }

    // BUSINESS METHODS - UPDATED
    isAssignedToBranch(): boolean {
        return !!this.branchId;
    }

    totalMaintenance(): number {       // ✅ NEW METHOD
        return this.maintenanceRecords.length + this.maintenanceSchedules.length;
    }

    totalReceipts(): number {          // ✅ NEW METHOD
        return this.rentalReceipts.length;
    }

    // SOFT DELETE
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

export type CreateStaffInput = CreateEntityInput<Staff>;
export type UpdateStaffInput = UpdateEntityInput<Staff>;