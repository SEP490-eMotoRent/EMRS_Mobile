import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

// ✅ DIRECT IMPORTS
import { Booking } from "../booking/Booking";
import { Branch } from "./Branch";
import { Staff } from "../account/Staff";

export class ChargingRecord implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public chargingDate?: Date;
    public startBatteryPercentage: number;
    public endBatteryPercentage: number;
    public kwhCharged: number;
    public ratePerKwh: number;
    public fee: number;
    public notes: string;
    public bookingId: string;
    public branchId: string;
    public staffId: string;

    // ✅ 3 RELATIONS ADDED (LINE 21-23)
    public booking: Booking;
    public branch: Branch;
    public staff: Staff;

    constructor(
        id: string,
        startBatteryPercentage: number,
        endBatteryPercentage: number,
        kwhCharged: number,
        ratePerKwh: number,
        fee: number,
        notes: string,
        bookingId: string,
        branchId: string,
        staffId: string,
        // ✅ RELATIONS PARAMS (LINE 33-35)
        booking: Booking,
        branch: Branch,
        staff: Staff,
        chargingDate?: Date,
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
        this.startBatteryPercentage = startBatteryPercentage;
        this.endBatteryPercentage = endBatteryPercentage;
        this.kwhCharged = kwhCharged;
        this.ratePerKwh = ratePerKwh;
        this.fee = fee;
        this.notes = notes;
        this.bookingId = bookingId;
        this.branchId = branchId;
        this.staffId = staffId;

        // Optional
        this.chargingDate = chargingDate;

        // ✅ RELATIONS ASSIGNED (LINE 57-59)
        this.booking = booking;
        this.branch = branch;
        this.staff = staff;
    }

    totalCost(): number {
        return this.kwhCharged * this.ratePerKwh;
    }

    // ✅ NEW BUSINESS METHOD
    batteryGained(): number {
        return this.endBatteryPercentage - this.startBatteryPercentage;
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

export type CreateChargingRecordInput = CreateEntityInput<ChargingRecord>;
export type UpdateChargingRecordInput = UpdateEntityInput<ChargingRecord>;