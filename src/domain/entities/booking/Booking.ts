import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";
import { Renter } from "../account/Renter";
import { Vehicle } from "../vehicle/Vehicle";
import { VehicleModel } from "../vehicle/VehicleModel"; // ✅ NEW IMPORT
import { InsurancePackage } from "../insurance/InsurancePackage";
import { RentalContract } from "./RentalContract";
import { RentalReceipt } from "./RentalReceipt";
import { Feedback } from "./Feedback";
import { InsuranceClaim } from "../insurance/InsuranceClaim";
import { AdditionalFee } from "./AdditionalFee";
import { Branch } from "../operations/Branch";
import { ChargingRecord } from "../operations/ChargingRecord";

export class Booking implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public startDatetime?: Date;
    public endDatetime?: Date;
    public actualReturnDatetime?: Date;
    public baseRentalFee: number;
    public depositAmount: number;
    public rentalDays: number;
    public rentalHours: number;
    public rentingRate: number;
    public lateReturnFee: number;
    public averageRentalPrice: number;
    public excessKmFee: number;
    public cleaningFee: number;
    public crossBranchFee: number;
    public totalChargingFee: number;
    public totalAdditionalFee: number;
    public totalRentalFee: number;
    public totalAmount: number;
    public refundAmount: number;
    public bookingStatus: string;
    
    // ✅ UPDATED: VehicleModelId is now REQUIRED, VehicleId is OPTIONAL
    public vehicleModelId: string;
    public renterId: string;
    public vehicleId?: string; // ✅ Changed to optional
    public insurancePackageId?: string;
    public handoverBranchId?: string;
    public returnBranchId?: string;

    // ✅ 12 RELATIONS (added VehicleModel)
    public renter: Renter;
    public vehicleModel: VehicleModel; // ✅ NEW REQUIRED RELATION
    public vehicle?: Vehicle; // ✅ Changed to optional
    public handoverBranch?: Branch;
    public returnBranch?: Branch;
    public insurancePackage?: InsurancePackage;
    public rentalContract?: RentalContract;
    public rentalReceipt?: RentalReceipt;
    public feedback?: Feedback;
    public insuranceClaim?: InsuranceClaim;
    public additionalFees: AdditionalFee[] = [];
    public chargingRecords: ChargingRecord[] = [];

    constructor(
        id: string,
        baseRentalFee: number,
        depositAmount: number,
        rentalDays: number,
        rentalHours: number,
        rentingRate: number,
        lateReturnFee: number,
        averageRentalPrice: number,
        excessKmFee: number,
        cleaningFee: number,
        crossBranchFee: number,
        totalChargingFee: number,
        totalAdditionalFee: number,
        totalRentalFee: number,
        totalAmount: number,
        refundAmount: number,
        bookingStatus: string,
        vehicleModelId: string, // ✅ NEW REQUIRED PARAM
        renterId: string,
        renter: Renter,
        vehicleModel: VehicleModel, // ✅ NEW REQUIRED RELATION
        vehicleId?: string, // ✅ Changed to optional
        vehicle?: Vehicle, // ✅ Changed to optional
        startDatetime?: Date,
        endDatetime?: Date,
        actualReturnDatetime?: Date,
        insurancePackageId?: string,
        insurancePackage?: InsurancePackage,
        rentalContract?: RentalContract,
        rentalReceipt?: RentalReceipt,
        handoverBranchId?: string,
        handoverBranch?: Branch,
        returnBranchId?: string,
        returnBranch?: Branch,
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
        this.baseRentalFee = baseRentalFee;
        this.depositAmount = depositAmount;
        this.rentalDays = rentalDays;
        this.rentalHours = rentalHours;
        this.rentingRate = rentingRate;
        this.lateReturnFee = lateReturnFee;
        this.averageRentalPrice = averageRentalPrice;
        this.excessKmFee = excessKmFee;
        this.cleaningFee = cleaningFee;
        this.crossBranchFee = crossBranchFee;
        this.totalChargingFee = totalChargingFee;
        this.totalAdditionalFee = totalAdditionalFee;
        this.totalRentalFee = totalRentalFee;
        this.totalAmount = totalAmount;
        this.refundAmount = refundAmount;
        this.bookingStatus = bookingStatus;
        this.vehicleModelId = vehicleModelId; // ✅ NEW
        this.renterId = renterId;

        // Optional fields
        this.vehicleId = vehicleId; // ✅ Now optional
        this.startDatetime = startDatetime;
        this.endDatetime = endDatetime;
        this.actualReturnDatetime = actualReturnDatetime;
        this.insurancePackageId = insurancePackageId;
        this.handoverBranchId = handoverBranchId;
        this.returnBranchId = returnBranchId;

        // ✅ RELATIONS ASSIGNED
        this.renter = renter;
        this.vehicleModel = vehicleModel; // ✅ NEW
        this.vehicle = vehicle; // ✅ Now optional
        this.insurancePackage = insurancePackage;
        this.rentalContract = rentalContract;
        this.rentalReceipt = rentalReceipt;
        this.handoverBranch = handoverBranch;
        this.returnBranch = returnBranch;
    }

    // BUSINESS METHODS - ENHANCED
    days(): number { return this.rentalDays; }
    totalFee(): number { return this.totalAmount; }
    isActive(): boolean { return this.bookingStatus === 'Active'; }
    totalAdditionalFees(): number { return this.additionalFees.reduce((sum, f) => sum + f.amount, 0); }
    totalCharging(): number { return this.chargingRecords.reduce((sum, c) => sum + c.fee, 0); }
    
    // ✅ NEW BUSINESS METHOD
    modelName(): string {
        return this.vehicleModel.modelName;
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

export type CreateBookingInput = CreateEntityInput<Booking>;
export type UpdateBookingInput = UpdateEntityInput<Booking>;