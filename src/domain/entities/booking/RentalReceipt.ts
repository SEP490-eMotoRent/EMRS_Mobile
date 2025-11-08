import { BaseEntity, CreateEntityInput, UpdateEntityInput } from '../shared/BaseEntity';
import { Booking } from "./Booking";
import { Staff } from "../account/Staff";

export class RentalReceipt implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public notes?: string;
    public renterConfirmedAt?: Date;
    public startOdometerKm: number;
    public endOdometerKm: number;
    public startBatteryPercentage: number;
    public endBatteryPercentage: number;
    public handOverVehicleImageFiles: string[];
    public checkListFile: string;
    public bookingId: string;
    public staffId: string;

    // ✅ RELATIONS
    public booking: Booking;
    public staff: Staff;

    constructor(
        id: string,
        startOdometerKm: number,
        endOdometerKm: number,
        startBatteryPercentage: number,
        endBatteryPercentage: number,
        handOverVehicleImageFiles: string[],
        checkListFile: string,
        bookingId: string,
        staffId: string,
        booking: Booking,      // ✅ ADDED
        staff: Staff,          // ✅ ADDED
        notes?: string,
        renterConfirmedAt?: Date,
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

        this.startOdometerKm = startOdometerKm;
        this.endOdometerKm = endOdometerKm;
        this.startBatteryPercentage = startBatteryPercentage;
        this.endBatteryPercentage = endBatteryPercentage;
        this.bookingId = bookingId;
        this.staffId = staffId;
        this.handOverVehicleImageFiles = handOverVehicleImageFiles;
        this.checkListFile = checkListFile;
        
        // ✅ RELATIONS
        this.booking = booking;
        this.staff = staff;

        this.notes = notes;
        this.renterConfirmedAt = renterConfirmedAt;
    }

    kmDriven(): number {
        return this.endOdometerKm - this.startOdometerKm;
    }

    batteryUsed(): number {
        return this.startBatteryPercentage - this.endBatteryPercentage;
    }

    isConfirmed(): boolean {
        return !!this.renterConfirmedAt;
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

export type CreateRentalReceiptInput = CreateEntityInput<RentalReceipt>;
export type UpdateRentalReceiptInput = UpdateEntityInput<RentalReceipt>;