import { Staff } from "../account/Staff";
import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';
import { Vehicle } from "../vehicle/Vehicle";
import { MaintenanceRecord } from "./MaintenanceRecord";

export class MaintenanceSchedule implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# FIELDS - EXACT MATCH
    public scheduleTitle: string;
    public description: string;
    public frequencyType: string;
    public frequencyValueKm: number;
    public frequencyValueDays: number;
    public checklist: string;
    public vehicleId: string;
    public staffId: string;

    public vehicle: Vehicle;
    public staff: Staff;
    public maintenanceRecord?: MaintenanceRecord;

    constructor(
        id: string,
        scheduleTitle: string,
        description: string,
        frequencyType: string,
        frequencyValueKm: number,
        frequencyValueDays: number,
        checklist: string,
        vehicleId: string,
        staffId: string,

        vehicle: Vehicle,
        staff: Staff,
        maintenanceRecord?: MaintenanceRecord,
        
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

        this.scheduleTitle = scheduleTitle;
        this.description = description;
        this.frequencyType = frequencyType;
        this.frequencyValueKm = frequencyValueKm;
        this.frequencyValueDays = frequencyValueDays;
        this.checklist = checklist;
        this.vehicleId = vehicleId;
        this.staffId = staffId;

        this.vehicle = vehicle;
        this.staff = staff;
        this.maintenanceRecord = maintenanceRecord;
    }

    isDue(mileage: number, lastMaintenanceDate: Date): boolean {
        const daysSince = Math.floor((new Date().getTime() - lastMaintenanceDate.getTime()) / (1000 * 60 * 60 * 24));
        return mileage >= this.frequencyValueKm || daysSince >= this.frequencyValueDays;
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

export type CreateMaintenanceScheduleInput = CreateEntityInput<MaintenanceSchedule>;
export type UpdateMaintenanceScheduleInput = UpdateEntityInput<MaintenanceSchedule>;