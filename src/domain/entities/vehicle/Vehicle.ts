import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';
import { VehicleModel } from "./VehicleModel";
import { Booking } from "../booking/Booking";
import { MaintenanceSchedule } from "../maintenance/MaintenanceSchedule";
import { RepairRequest } from "../maintenance/RepairRequest";
import { Branch } from '../operations/Branch';
import { RentalReceipt } from '../booking/RentalReceipt';
import { VehicleTransferOrder } from './VehicleTransferOrder';

export class Vehicle implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // CORRECTED: All properties match C# backend
    public licensePlate: string;
    public color: string;
    public dateManufacturing?: Date; // FIXED: was yearOfManufacture
    public currentOdometerKm: number;
    public batteryHealthPercentage: number;
    public status: string;
    public purchaseDate?: Date;
    public description: string;
    public branchId: string;
    public vehicleModelId: string;
    public gpsDeviceIdent?: string; // ADDED
    public flespiDeviceId?: number; // ADDED
    public fileUrl?: string[];

    public branch: Branch;
    public vehicleModel: VehicleModel;
    public rentalReceipts: RentalReceipt[] = []; // ADDED
    public bookings: Booking[] = [];
    public vehicleTransferOrders: VehicleTransferOrder[] = []; // ADDED
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
        // ✅ RELATIONS PARAMS
        branch: Branch,
        vehicleModel: VehicleModel,
        rentalReceipts: RentalReceipt[] = [],
        bookings: Booking[] = [],
        vehicleTransferOrders: VehicleTransferOrder[] = [],
        repairRequests: RepairRequest[] = [],
        // ✅ OPTIONAL FIELDS
        dateManufacturing?: Date,
        purchaseDate?: Date,
        gpsDeviceIdent?: string,
        flespiDeviceId?: number,
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false,
        fileUrl?: string[]
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
        this.dateManufacturing = dateManufacturing;
        this.purchaseDate = purchaseDate;
        this.gpsDeviceIdent = gpsDeviceIdent;
        this.flespiDeviceId = flespiDeviceId;
        this.fileUrl = fileUrl;
        // Relations
        this.branch = branch;
        this.vehicleModel = vehicleModel;
        this.rentalReceipts = rentalReceipts;
        this.bookings = bookings;
        this.vehicleTransferOrders = vehicleTransferOrders;
        this.repairRequests = repairRequests;
    }

    isAvailable(): boolean {
        return this.status === 'Available';
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