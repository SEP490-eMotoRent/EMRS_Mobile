import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

// ✅ DIRECT IMPORTS
import { Staff } from "../account/Staff";
import { Vehicle } from "../vehicle/Vehicle";
import { VehicleTransferOrder } from "../vehicle/VehicleTransferOrder";
import { Booking } from "../booking/Booking";
import { ChargingRecord } from "./ChargingRecord";

export class Branch implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public branchName: string;
    public address: string;
    public city: string;
    public phone: string;
    public email: string;
    public latitude: number;
    public longitude: number;
    public openingTime: string;
    public closingTime: string;

    // ✅ 7 RELATIONS ADDED (LINE 20-26)
    public staffs: Staff[] = [];
    public vehicles: Vehicle[] = [];
    public chargingRecords: ChargingRecord[] = [];
    public sentTransferOrders: VehicleTransferOrder[] = [];
    public receivedTransferOrders: VehicleTransferOrder[] = [];
    public handoverBookings: Booking[] = [];
    public returnBookings: Booking[] = [];

    constructor(
        id: string,
        branchName: string,
        address: string,
        city: string,
        phone: string,
        email: string,
        latitude: number,
        longitude: number,
        openingTime: string,
        closingTime: string,
        // ✅ RELATIONS PARAMS (LINE 36-42)
        staffs: Staff[] = [],
        vehicles: Vehicle[] = [],
        chargingRecords: ChargingRecord[] = [],
        sentTransferOrders: VehicleTransferOrder[] = [],
        receivedTransferOrders: VehicleTransferOrder[] = [],
        handoverBookings: Booking[] = [],
        returnBookings: Booking[] = [],
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

        this.branchName = branchName;
        this.address = address;
        this.city = city;
        this.phone = phone;
        this.email = email;
        this.latitude = latitude;
        this.longitude = longitude;
        this.openingTime = openingTime;
        this.closingTime = closingTime;

        // ✅ RELATIONS ASSIGNED (LINE 58-64)
        this.staffs = staffs;
        this.vehicles = vehicles;
        this.chargingRecords = chargingRecords;
        this.sentTransferOrders = sentTransferOrders;
        this.receivedTransferOrders = receivedTransferOrders;
        this.handoverBookings = handoverBookings;
        this.returnBookings = returnBookings;
    }

    fullAddress(): string {
        return `${this.branchName}, ${this.address}, ${this.city}`;
    }

    // ✅ NEW BUSINESS METHODS
    totalVehicles(): number { return this.vehicles.length; }
    totalStaff(): number { return this.staffs.length; }
    totalBookings(): number { return this.handoverBookings.length + this.returnBookings.length; }

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

export type CreateBranchInput = CreateEntityInput<Branch>;
export type UpdateBranchInput = UpdateEntityInput<Branch>;