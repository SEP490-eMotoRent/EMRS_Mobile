import { Renter } from "../account/Renter";
import { InsuranceClaim } from "../insurance/InsuranceClaim";
import { InsurancePackage } from "../insurance/InsurancePackage";
import { Branch } from "../operations/Branch";
import { ChargingRecord } from "../operations/ChargingRecord";
import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";
import { Vehicle } from "../vehicle/Vehicle";
import { VehicleModel } from "../vehicle/VehicleModel";
import { AdditionalFee } from "./AdditionalFee";
import { Feedback } from "./Feedback";
import { RentalContract } from "./RentalContract";
import { RentalReceipt } from "./RentalReceipt";

/**
 * ✅ FIXED Booking Entity
 * 
 * Changes from original:
 * 1. All navigation properties are now OPTIONAL (matches backend lazy loading)
 * 2. Fixed collections: rentalReceipts (plural), insuranceClaims (added)
 * 3. Constructor parameters all optional for navigation properties
 * 4. Business methods handle undefined gracefully
 */
export class Booking implements BaseEntity {
    // =========================================================================
    // BASE ENTITY FIELDS
    // =========================================================================
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // =========================================================================
    // BOOKING FIELDS (Primitives)
    // =========================================================================
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
    public bookingStatus: string;  // ✅ Plain string (not enum)
    public bookingCode: string;
    
    // Foreign Keys
    public vehicleModelId: string;
    public renterId: string;
    public vehicleId?: string;
    public insurancePackageId?: string;
    public handoverBranchId?: string;
    public returnBranchId?: string;

    // =========================================================================
    // NAVIGATION PROPERTIES (All Optional - matches backend lazy loading)
    // =========================================================================
    public renter?: Renter;                      // ✅ Changed to optional
    public vehicleModel?: VehicleModel;          // ✅ Changed to optional
    public vehicle?: Vehicle;
    public handoverBranch?: Branch;
    public returnBranch?: Branch;
    public insurancePackage?: InsurancePackage;
    public rentalContract?: RentalContract;
    public feedback?: Feedback;
    
    // =========================================================================
    // COLLECTIONS (Match Backend)
    // =========================================================================
    public rentalReceipts: RentalReceipt[] = [];     // ✅ Changed from singular
    public insuranceClaims: InsuranceClaim[] = [];   // ✅ Added (was missing)
    public additionalFees: AdditionalFee[] = [];
    public chargingRecords: ChargingRecord[] = [];

    constructor(
        id: string,
        bookingCode: string,
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
        vehicleModelId: string,
        renterId: string,
        renter?: Renter,              // ✅ Now optional
        vehicleModel?: VehicleModel,  // ✅ Now optional
        vehicleId?: string,
        vehicle?: Vehicle,
        startDatetime?: Date,
        endDatetime?: Date,
        actualReturnDatetime?: Date,
        insurancePackageId?: string,
        insurancePackage?: InsurancePackage,
        rentalContract?: RentalContract,
        rentalReceipts?: RentalReceipt[],     // ✅ Changed from singular
        handoverBranchId?: string,
        handoverBranch?: Branch,
        returnBranchId?: string,
        returnBranch?: Branch,
        feedback?: Feedback,
        insuranceClaims?: InsuranceClaim[],   // ✅ Added
        additionalFees?: AdditionalFee[],
        chargingRecords?: ChargingRecord[],
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false
    ) {
        // Base entity fields
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;

        // Required primitive fields
        this.bookingCode = bookingCode;
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
        this.vehicleModelId = vehicleModelId;
        this.renterId = renterId;

        // Optional primitive fields
        this.vehicleId = vehicleId;
        this.startDatetime = startDatetime;
        this.endDatetime = endDatetime;
        this.actualReturnDatetime = actualReturnDatetime;
        this.insurancePackageId = insurancePackageId;
        this.handoverBranchId = handoverBranchId;
        this.returnBranchId = returnBranchId;

        // Navigation properties (all optional)
        this.renter = renter;
        this.vehicleModel = vehicleModel;
        this.vehicle = vehicle;
        this.insurancePackage = insurancePackage;
        this.rentalContract = rentalContract;
        this.handoverBranch = handoverBranch;
        this.returnBranch = returnBranch;
        this.feedback = feedback;

        // Collections
        this.rentalReceipts = rentalReceipts ?? [];
        this.insuranceClaims = insuranceClaims ?? [];
        this.additionalFees = additionalFees ?? [];
        this.chargingRecords = chargingRecords ?? [];
    }

    // =========================================================================
    // BUSINESS METHODS (Handle undefined navigation properties)
    // =========================================================================
    
    days(): number { 
        return this.rentalDays; 
    }
    
    totalFee(): number { 
        return this.totalAmount; 
    }
    
    isActive(): boolean { 
        return this.bookingStatus === 'Active'; 
    }
    
    isPending(): boolean {
        return this.bookingStatus === 'Pending';
    }
    
    isBooked(): boolean {
        return this.bookingStatus === 'Booked';
    }
    
    isCancelled(): boolean {
        return this.bookingStatus === 'Cancelled';
    }
    
    totalAdditionalFees(): number { 
        return this.additionalFees.reduce((sum, f) => sum + f.amount, 0); 
    }
    
    totalCharging(): number { 
        return this.chargingRecords.reduce((sum, c) => sum + c.fee, 0); 
    }
    
    /**
     * ✅ Handle undefined vehicleModel gracefully
     */
    modelName(): string {
        return this.vehicleModel?.modelName ?? "Unknown Model";
    }
    
    /**
     * ✅ Handle undefined renter gracefully
     */
    renterName(): string {
        return this.renter?.account?.fullname ?? "Unknown Renter";
    }
    
    /**
     * ✅ Check if vehicle is assigned
     */
    hasVehicleAssigned(): boolean {
        return this.vehicleId !== undefined && this.vehicleId !== null;
    }
    
    /**
     * ✅ Get license plate if vehicle assigned
     */
    vehicleLicensePlate(): string | undefined {
        return this.vehicle?.licensePlate;
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

    isVNPayPending(): boolean {
        return this.bookingStatus === 'Pending' && !this.vehicleId;
    }
    
    /**
     * ✅ Check if booking can be cancelled
     */
    canBeCancelled(): boolean {
        return this.bookingStatus === 'Pending' || this.bookingStatus === 'Booked';
    }
    
    /**
     * ✅ Get display code (use bookingCode if available, else short ID)
     */
    getDisplayCode(): string {
        return this.bookingCode || `#${this.id.slice(0, 8).toUpperCase()}`;
    }
    
    /**
     * ✅ Check if full details are loaded
     */
    hasFullDetails(): boolean {
        return this.renter !== undefined && this.vehicleModel !== undefined;
    }
    
    /**
     * ✅ Calculate time until booking starts
     */
    getTimeUntilStart(): number | null {
        if (!this.startDatetime) return null;
        return this.startDatetime.getTime() - Date.now();
    }
    
    /**
     * ✅ Check if booking is expired (past start time and still pending)
     */
    isExpired(): boolean {
        if (!this.startDatetime) return false;
        return this.isPending() && Date.now() > this.startDatetime.getTime();
    }
}

export type CreateBookingInput = CreateEntityInput<Booking>;
export type UpdateBookingInput = UpdateEntityInput<Booking>;