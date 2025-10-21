import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';

// ✅ DIRECT IMPORTS
import { Staff } from "../account/Staff";
import { MaintenanceSchedule } from "./MaintenanceSchedule";

export class MaintenanceRecord implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public maintenanceDate?: Date;
    public issuesFound: string;
    public completedAt?: Date;
    public staffId: string;
    public maintenanceScheduleId: string;

    // ✅ 2 RELATIONS ADDED (LINE 17-18)
    public staff: Staff;
    public maintenanceSchedule: MaintenanceSchedule;

    constructor(
        id: string,
        issuesFound: string,
        staffId: string,
        maintenanceScheduleId: string,
        // ✅ RELATIONS PARAMS (LINE 24-25)
        staff: Staff,
        maintenanceSchedule: MaintenanceSchedule,
        maintenanceDate?: Date,
        completedAt?: Date,
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
        this.issuesFound = issuesFound;
        this.staffId = staffId;
        this.maintenanceScheduleId = maintenanceScheduleId;

        // Optional fields
        this.maintenanceDate = maintenanceDate;
        this.completedAt = completedAt;

        // ✅ RELATIONS ASSIGNED (LINE 45-46)
        this.staff = staff;
        this.maintenanceSchedule = maintenanceSchedule;
    }

    isCompleted(): boolean {
        return !!this.completedAt;
    }

    // ✅ NEW BUSINESS METHOD
    staffName(): string {
        return this.staff.account.fullname || '';
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

export type CreateMaintenanceRecordInput = CreateEntityInput<MaintenanceRecord>;
export type UpdateMaintenanceRecordInput = UpdateEntityInput<MaintenanceRecord>;