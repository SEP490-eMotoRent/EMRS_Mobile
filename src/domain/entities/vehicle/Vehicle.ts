import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';
import { VehicleModel } from "./VehicleModel";
import { Booking } from "../booking/Booking";
import { MaintenanceSchedule } from "../maintenance/MaintenanceSchedule";
import { RepairRequest } from "../maintenance/RepairRequest";
import { Branch } from '../operations/Branch';

export class Vehicle implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public licensePlate: string;
    public color: string;
    public yearOfManufacture?: Date;
    public currentOdometerKm: number;
    public batteryHealthPercentage: number;
    public status: string;
    public lastMaintenanceDate?: Date;
    public nextMaintenanceDue?: Date;
    public fileUrl?: string[];
    public purchaseDate?: Date;
    public description: string;
    public branchId: string;
    public vehicleModelId: string;
    // ✅ REMOVED: rentalPricing property (doesn't exist in backend)
    // Backend doesn't have this field, rental pricing is on VehicleModel -> RentalPricing

    // ✅ 5 RELATIONS (matching backend exactly)
    public branch: Branch;
    public vehicleModel: VehicleModel;
    public bookings: Booking[] = [];
    public maintenanceSchedules: MaintenanceSchedule[] = [];
    public repairRequests: RepairRequest[] = [];

    constructor(
        id: string,
        licensePlate: string,
        color: string,
        currentOdometerKm: number,
        batteryHealthPercentage: number,
        status: string,
        description: string,
        branchId: string,
        vehicleModelId: string,
        // ✅ RELATIONS PARAMS (matching backend)
        branch: Branch,
        vehicleModel: VehicleModel,
        bookings: Booking[] = [],
        maintenanceSchedules: MaintenanceSchedule[] = [],
        repairRequests: RepairRequest[] = [],
        yearOfManufacture?: Date,
        lastMaintenanceDate?: Date,
        nextMaintenanceDue?: Date,
        fileUrl?: string[],
        purchaseDate?: Date,
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

        this.licensePlate = licensePlate;
        this.color = color;
        this.currentOdometerKm = currentOdometerKm;
        this.batteryHealthPercentage = batteryHealthPercentage;
        this.status = status;
        this.description = description;
        this.branchId = branchId;
        this.vehicleModelId = vehicleModelId;
        
        // Optional fields
        this.yearOfManufacture = yearOfManufacture;
        this.lastMaintenanceDate = lastMaintenanceDate;
        this.nextMaintenanceDue = nextMaintenanceDue;
        this.fileUrl = fileUrl;
        this.purchaseDate = purchaseDate;

        // Relations
        this.branch = branch;
        this.vehicleModel = vehicleModel;
        this.bookings = bookings;
        this.maintenanceSchedules = maintenanceSchedules;
        this.repairRequests = repairRequests;
    }

    isAvailable(): boolean {
        return this.status === 'Available';
    }

    isMaintenanceDue(): boolean {
        return !!this.nextMaintenanceDue && new Date() >= this.nextMaintenanceDue;
    }

    updateOdometer(km: number): void {
        this.currentOdometerKm = km;
        this.updatedAt = new Date();
    }

    modelName(): string {
        return this.vehicleModel.modelName;
    }

    branchName(): string {
        return this.branch.branchName;
    }

    totalBookings(): number {
        return this.bookings.length;
    }

    // ✅ NEW: Access rental pricing through VehicleModel
    dailyRentalPrice(): number {
        return this.vehicleModel.dailyRentalPrice();
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

export type CreateVehicleInput = CreateEntityInput<Vehicle>;
export type UpdateVehicleInput = UpdateEntityInput<Vehicle>;