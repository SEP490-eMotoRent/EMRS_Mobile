import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { Booking } from "../../../domain/entities/booking/Booking";
import { RentalContract } from "../../../domain/entities/booking/RentalContract";
import { RentalReceipt } from "../../../domain/entities/booking/RentalReceipt";
import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { InsurancePackage } from "../../../domain/entities/insurance/InsurancePackage";
import { Branch } from "../../../domain/entities/operations/Branch";
import { Vehicle } from "../../../domain/entities/vehicle/Vehicle";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import {
  BookingRepository,
  VNPayBookingResult,
} from "../../../domain/repositories/booking/BookingRepository";
import { BookingRemoteDataSource } from "../../datasources/interfaces/remote/booking/BookingRemoteDataSource";
import { BookingResponse } from "../../models/booking/BookingResponse";
import {
  BookingResponseForRenter,
  InsurancePackageResponse,
  RenterDetailResponse,
  VehicleModelResponse,
} from "../../models/booking/BookingResponseForRenter";
import { BookingWithoutWalletResponse } from "../../models/booking/BookingWithoutWalletResponse";
import { CreateBookingRequest } from "../../models/booking/CreateBookingRequest";
import { PaginatedBooking } from "../../models/booking/PaginatedBooking";
import { PaginatedBookingResponse } from "../../models/booking/PaginatedBookingResponse";
import {
  AccountBookingResponse,
  BookingForStaffResponse,
  BranchBookingResponse,
  InsurancePackageBookingResponse,
  RentalContractBookingResponse,
  RentalPricingBookingResponse,
  RentalReceiptBookingResponse,
  RenterBookingResponse,
  VehicleBookingResponse,
  VehicleModelBookingResponse,
} from "../../models/booking/staffResponse/BookingResponseForStaff";
import { VNPayCallback } from "../../models/booking/vnpay/VNPayCallback";

export class BookingRepositoryImpl implements BookingRepository {
  constructor(private remote: BookingRemoteDataSource) {}

  // =========================================================================
  // CREATE
  // =========================================================================
  async create(booking: Booking): Promise<Booking> {
    const request: CreateBookingRequest = {
      startDatetime: booking.startDatetime?.toISOString(),
      endDatetime: booking.endDatetime?.toISOString(),
      handoverBranchId: booking.handoverBranchId!,
      baseRentalFee: booking.baseRentalFee,
      depositAmount: booking.depositAmount,
      rentalDays: booking.rentalDays,
      rentalHours: booking.rentalHours,
      rentingRate: booking.rentingRate,
      vehicleModelId: booking.vehicleModelId,
      averageRentalPrice: booking.averageRentalPrice,
      insurancePackageId: booking.insurancePackageId,
      totalRentalFee: booking.totalRentalFee,
    };

    const response = await this.remote.create(request);
    return this.mapSimpleResponseToEntity(response);
  }

  // =========================================================================
  // CREATE VNPAY - Returns minimal entity
  // =========================================================================
  async createVNPay(booking: Booking): Promise<VNPayBookingResult> {
    const request: CreateBookingRequest = {
      startDatetime: booking.startDatetime?.toISOString(),
      endDatetime: booking.endDatetime?.toISOString(),
      handoverBranchId: booking.handoverBranchId!,
      baseRentalFee: booking.baseRentalFee,
      depositAmount: booking.depositAmount,
      rentalDays: booking.rentalDays,
      rentalHours: booking.rentalHours,
      rentingRate: booking.rentingRate,
      vehicleModelId: booking.vehicleModelId,
      averageRentalPrice: booking.averageRentalPrice,
      insurancePackageId: booking.insurancePackageId,
      totalRentalFee: booking.totalRentalFee,
    };

    const response = await this.remote.createVNPay(request);

    console.log(
      "📥 VNPay Response from backend:",
      JSON.stringify(response, null, 2)
    );

    // ✅ Validate response has required fields
    if (!response.id || !response.vnpayUrl) {
      console.error("❌ Invalid VNPay response:", response);
      throw new Error(
        "Invalid VNPay booking response from server - missing id or vnpayUrl"
      );
    }

    console.log("✅ VNPay URL extracted:", response.vnpayUrl);

    return {
      booking: this.mapVNPayResponseToEntity(response),
      vnpayUrl: response.vnpayUrl, // ✅ This must match the field name from backendQ
    };
  }

  // =========================================================================
  // READ
  // =========================================================================
  async getById(id: string): Promise<Booking | null> {
    const response = await this.remote.getById(id);
    return response ? this.mapStaffResponseToEntity(response) : null;
  }

  async getByIdForStaff(id: string): Promise<Booking | null> {
    const response = await this.remote.getById(id);
    return response ? this.mapStaffResponseToEntity(response) : null;
  }

  async getByRenter(renterId: string): Promise<Booking[]> {
    const responses = await this.remote.getByRenter(renterId);
    return responses.map((r) => this.mapListResponseToEntity(r));
  }

  async getCurrentRenterBookings(): Promise<Booking[]> {
    const responses = await this.remote.getCurrentRenterBookings();
    console.log("📦 Repository received responses:", responses.length);
    return responses.map((r) => this.mapListResponseToEntity(r));
  }

  async confirmVNPayPayment(request: VNPayCallback): Promise<void> {
    return this.remote.confirmVNPayPayment(request);
  }

  async getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    pageNum: number,
    pageSize: number
  ): Promise<PaginatedBooking> {
    const paginatedResponse: PaginatedBookingResponse =
      await this.remote.getBookings(
        vehicleModelId,
        renterId,
        bookingStatus,
        pageNum,
        pageSize
      );

    const items = paginatedResponse.items.map((item) => {
      if (this.isStaffResponse(item)) {
        return this.mapStaffResponseToEntity(item);
      }
      return this.mapListResponseToEntity(item);
    });

    return {
      currentPage: paginatedResponse.currentPage,
      pageSize: paginatedResponse.pageSize,
      totalItems: paginatedResponse.totalItems,
      totalPages: paginatedResponse.totalPages,
      items,
    };
  }

  async assignVehicle(vehicleId: string, bookingId: string): Promise<void> {
    await this.remote.assignVehicle(vehicleId, bookingId);
  }

  // =========================================================================
  // TYPE GUARD
  // =========================================================================
  private isStaffResponse(item: any): item is BookingForStaffResponse {
    return "vehicle" in item && item.vehicle !== undefined;
  }

  // =========================================================================
  // ✅ VNPAY MAPPER - NO MOCK DATA
  // =========================================================================
  private mapVNPayResponseToEntity(dto: BookingWithoutWalletResponse): Booking {
    console.log("🔄 Mapping VNPay booking response:", dto.id);
    // console.log("📝 Booking code:", dto.bookingCode); // ← Should print actual code

    return new Booking(
      dto.id,
      "", // ← USE ACTUAL BOOKING CODE
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate,
      dto.lateReturnFee || 0,
      dto.averageRentalPrice,
      0, // excessKmFee
      0, // cleaningFee
      0, // crossBranchFee
      0, // totalChargingFee
      0, // totalAdditionalFee
      dto.totalRentalFee,
      dto.totalAmount,
      0, // refundAmount
      dto.bookingStatus,
      dto.vehicleModelId,
      dto.renterId,
      undefined, // renter
      undefined, // vehicleModel
      dto.vehicleId,
      undefined, // vehicle
      dto.startDatetime ? new Date(dto.startDatetime) : undefined,
      dto.endDatetime ? new Date(dto.endDatetime) : undefined,
      dto.actualReturnDatetime ? new Date(dto.actualReturnDatetime) : undefined,
      undefined, // insurancePackageId
      undefined, // insurancePackage
      undefined, // rentalContract
      undefined, // rentalReceipts
      undefined, // handoverBranchId
      undefined, // handoverBranch
      undefined, // returnBranchId
      undefined, // returnBranch
      undefined, // feedback
      undefined, // insuranceClaims
      undefined, // additionalFees
      undefined, // chargingRecords
      new Date(),
      null,
      null,
      false
    );
  }

  // =========================================================================
  // ✅ SIMPLE MAPPER - NO MOCK DATA
  // =========================================================================
  private mapSimpleResponseToEntity(dto: BookingResponse): Booking {
    console.log("🔄 Mapping simple booking response:", dto.id);

    return new Booking(
      dto.id,
      "",
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate,
      dto.lateReturnFee || 0,
      dto.averageRentalPrice,
      0, // excessKmFee
      0, // cleaningFee
      0, // crossBranchFee
      0, // totalChargingFee
      0, // totalAdditionalFee
      dto.totalRentalFee,
      dto.totalAmount,
      0, // refundAmount
      dto.bookingStatus,
      dto.vehicleModelId,
      dto.renterId,
      undefined, // renter
      undefined, // vehicleModel
      dto.vehicleId,
      undefined, // vehicle
      dto.startDatetime ? new Date(dto.startDatetime) : undefined,
      dto.endDatetime ? new Date(dto.endDatetime) : undefined,
      dto.actualReturnDatetime ? new Date(dto.actualReturnDatetime) : undefined,
      undefined, // insurancePackageId
      undefined, // insurancePackage
      undefined, // rentalContract
      undefined, // rentalReceipts
      undefined, // handoverBranchId
      undefined, // handoverBranch
      undefined, // returnBranchId
      undefined, // returnBranch
      undefined, // feedback
      undefined, // insuranceClaims
      undefined, // additionalFees
      undefined, // chargingRecords
      new Date(),
      null,
      null,
      false
    );
  }

  // ✅ NEW: Cancel booking
  async cancelBooking(bookingId: string): Promise<Booking> {
    console.log("🔄 [REPOSITORY] Cancelling booking:", bookingId);

    const response = await this.remote.cancelBooking(bookingId);

    // Map the BookingResponse to Booking entity
    const cancelledBooking = new Booking(
      response.id,
      response.bookingCode,
      response.baseRentalFee,
      response.depositAmount,
      response.rentalDays,
      response.rentalHours,
      response.rentingRate,
      response.lateReturnFee || 0,
      response.averageRentalPrice,
      0, // excessKmFee
      0, // cleaningFee
      0, // crossBranchFee
      0, // totalChargingFee
      0, // totalAdditionalFee
      response.totalRentalFee,
      response.totalAmount,
      0, // refundAmount
      response.bookingStatus, // Should be "Cancelled"
      response.vehicleModelId,
      response.renterId,
      undefined, // renter
      undefined, // vehicleModel
      response.vehicleId,
      undefined, // vehicle
      response.startDatetime ? new Date(response.startDatetime) : undefined,
      response.endDatetime ? new Date(response.endDatetime) : undefined,
      response.actualReturnDatetime
        ? new Date(response.actualReturnDatetime)
        : undefined,
      undefined, // insurancePackageId
      undefined, // insurancePackage
      undefined, // rentalContract
      undefined, // rentalReceipts
      undefined, // handoverBranchId
      undefined, // handoverBranch
      undefined, // returnBranchId
      undefined, // returnBranch
      undefined, // feedback
      undefined, // insuranceClaims
      undefined, // additionalFees
      undefined, // chargingRecords
      new Date(),
      null,
      null,
      false
    );

    console.log(
      "✅ [REPOSITORY] Booking cancelled and mapped:",
      cancelledBooking.bookingStatus
    );
    return cancelledBooking;
  }

  // =========================================================================
  //  LIST MAPPER - WITH NESTED OBJECTS
  // =========================================================================
  private mapListResponseToEntity(dto: BookingResponseForRenter): Booking {
    console.log("🔄 Mapping list booking response:", dto.id);

    const vehicleModel = dto.vehicleModel
      ? this.mapVehicleModelFromListResponse(dto.vehicleModel)
      : undefined;

    const renter = dto.renter
      ? this.mapRenterFromListResponse(dto.renter)
      : undefined;

    const insurancePackage = dto.insurancePackage
      ? this.mapInsurancePackageFromResponse(dto.insurancePackage)
      : undefined;

    return new Booking(
      dto.id,
      dto.bookingCode,
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate,
      dto.lateReturnFee || 0,
      dto.averageRentalPrice,
      0,
      0,
      0,
      0,
      0,
      dto.totalRentalFee,
      dto.totalAmount,
      0,
      dto.bookingStatus,
      dto.vehicleModelId,
      dto.renterId,
      renter,
      vehicleModel,
      dto.vehicleId,
      undefined, // vehicle - Not in list response
      dto.startDatetime ? new Date(dto.startDatetime) : undefined,
      dto.endDatetime ? new Date(dto.endDatetime) : undefined,
      dto.actualReturnDatetime ? new Date(dto.actualReturnDatetime) : undefined,
      insurancePackage?.id,
      insurancePackage,
      undefined, // rentalContract
      undefined, // rentalReceipts
      undefined, // handoverBranchId
      undefined, // handoverBranch
      undefined, // returnBranchId
      undefined, // returnBranch
      undefined, // feedback
      undefined, // insuranceClaims
      undefined, // additionalFees
      undefined, // chargingRecords
      new Date(),
      null,
      null,
      false
    );
  }

  // =========================================================================
  // NESTED OBJECT MAPPERS
  // =========================================================================
  private mapVehicleModelFromListResponse(
    dto: VehicleModelResponse
  ): VehicleModel {
    return new VehicleModel(
      dto.id,
      dto.modelName,
      dto.category,
      dto.batteryCapacityKwh,
      dto.maxRangeKm,
      dto.maxSpeedKmh,
      dto.description,
      "",
      undefined,
      new Date(),
      undefined,
      undefined,
      undefined
    );
  }

  private mapRenterFromListResponse(dto: RenterDetailResponse): Renter {
    const account = dto.account
      ? new Account(
          dto.account.id,
          dto.account.username,
          "",
          dto.account.role,
          dto.account.fullname || ""
        )
      : undefined;

    return new Renter(
      dto.id,
      dto.email,
      dto.phone,
      dto.address,
      dto.account?.id || dto.id,
      "unknown",
      false,
      "",
      dto.dateOfBirth,
      undefined,
      "",
      undefined,
      account
    );
  }

  private mapInsurancePackageFromResponse(
    dto: InsurancePackageResponse
  ): InsurancePackage {
    return new InsurancePackage(
      dto.id,
      dto.packageName,
      dto.packageFee,
      dto.coveragePersonLimit,
      dto.coveragePropertyLimit,
      dto.coverageVehiclePercentage,
      dto.coverageTheft,
      dto.deductibleAmount,
      dto.description,
      true,
      new Date(),
      null,
      null,
      false
    );
  }

  // =========================================================================
  // STAFF RESPONSE MAPPER - FULL DETAILS
  // =========================================================================
  private mapStaffResponseToEntity(dto: BookingForStaffResponse): Booking {
    const renter = this.mapRenterFromStaffResponse(dto.renter);
    const vehicle = dto?.vehicle
      ? this.mapVehicleFromStaffResponse(dto.vehicle)
      : undefined;

    const vehicleModel = dto.vehicleModel
      ? this.mapVehicleModelFromStaffResponse(dto.vehicleModel)
      : undefined;

    const rentalContract = dto.rentalContract
      ? this.mapRentalContractFromStaffResponse(dto.rentalContract)
      : undefined;

    const rentalReceipt = dto.rentalReceipt
      ? this.mapRentalReceiptFromStaffResponse(dto.rentalReceipt)
      : undefined;

    const insurancePackage = dto.insurancePackage
      ? this.mapInsurancePackageFromStaffResponse(dto.insurancePackage)
      : undefined;

    const handoverBranch = dto.handoverBranch
      ? this.mapBranchFromStaffResponse(dto.handoverBranch)
      : undefined;

    return new Booking(
      dto?.id,
      "",
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate,
      dto.lateReturnFee || 0,
      dto.averageRentalPrice,
      0,
      0,
      0,
      0,
      0,
      dto.totalRentalFee,
      dto.totalAmount,
      0,
      dto.bookingStatus,
      vehicleModel?.id ?? "unknown-model",
      renter?.id ?? "unknown-renter",
      renter,
      vehicleModel,
      vehicle?.id,
      vehicle,
      dto.startDatetime ? new Date(dto.startDatetime) : undefined,
      dto.endDatetime ? new Date(dto.endDatetime) : undefined,
      dto.actualReturnDatetime ? new Date(dto.actualReturnDatetime) : undefined,
      insurancePackage?.id ?? "unknown-insurance-package",
      insurancePackage,
      rentalContract,
      rentalReceipt ? [rentalReceipt] : undefined, // ✅ Convert to array
      handoverBranch?.id ?? "unknown-handover-branch",
      handoverBranch,
      undefined,
      undefined,
      undefined, // feedback
      undefined, // insuranceClaims
      undefined, // additionalFees
      undefined, // chargingRecords
      new Date(),
      null,
      null,
      false
    );
  }

  private mapBranchFromStaffResponse(dto: BranchBookingResponse): Branch {
    return new Branch(
      dto.id,
      dto.branchName,
      dto.address,
      dto.city,
      dto.phone,
      dto.email,
      0,
      0,
      dto.openingTime,
      dto.closingTime,
      [],
      [],
      [],
      [],
    );
  }

  private mapAccountFromStaffResponse(dto: AccountBookingResponse): Account {
    return new Account(
      dto?.id || "unknown-account",
      dto?.username || "unknown-username",
      "",
      dto?.role || "unknown-role",
      dto?.fullname || "unknown-fullname"
    );
  }

  private mapInsurancePackageFromStaffResponse(
    dto: InsurancePackageBookingResponse
  ): InsurancePackage {
    return new InsurancePackage(
      dto.id,
      dto.packageName,
      dto.packageFee,
      dto.coveragePersonLimit,
      dto.coveragePropertyLimit,
      dto.coverageVehiclePercentage,
      dto.coverageTheft,
      dto.deductibleAmount,
      dto.description,
      true,
      new Date(),
      null,
      null,
      false
    );
  }

  private mapVehicleModelFromStaffResponse(
    dto: VehicleModelBookingResponse
  ): VehicleModel {
    return new VehicleModel(
      dto.id,
      dto.modelName,
      dto.category,
      dto.batteryCapacityKwh,
      dto.maxRangeKm,
      dto.maxSpeedKmh,
      "",
      "",
      undefined,
      new Date(),
      undefined,
      undefined,
      undefined
    );
  }

  private mapRentalContractFromStaffResponse(
    dto: RentalContractBookingResponse
  ): RentalContract {
    return new RentalContract(
      dto.id,
      dto.contractNumber,
      dto.contractTerms,
      dto.otpCode,
      dto.contractStatus,
      dto.file,
      undefined,
      undefined
    );
  }

  private mapRentalReceiptFromStaffResponse(
    dto: RentalReceiptBookingResponse
  ): RentalReceipt {
    return new RentalReceipt(
      dto.id,
      dto.startOdometerKm,
      dto.endOdometerKm,
      dto.startBatteryPercentage,
      dto.endBatteryPercentage,
      dto.handOverVehicleImageFiles,
      dto.returnVehicleImageFiles,
      dto.checkListFile?.[0],
      dto.bookingId,
      dto.staffId,
      undefined,
      undefined,
      dto.notes,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  private mapRenterFromStaffResponse(dto: RenterBookingResponse): Renter {
    return new Renter(
      dto.id,
      dto.email || "",
      dto.phone || "",
      dto.address || "",
      dto.account?.id || "unknown-account",
      "unknown",
      false,
      "",
      dto.dateOfBirth,
      undefined,
      dto.avatarUrl,
      undefined,
      this.mapAccountFromStaffResponse(dto.account)
    );
  }

  private mapVehicleFromStaffResponse(dto: VehicleBookingResponse): Vehicle {
    const vehicleModel = new VehicleModel(
      dto.vehicleModel?.id,
      dto.vehicleModel?.modelName,
      dto.vehicleModel?.category,
      dto.vehicleModel?.batteryCapacityKwh,
      dto.vehicleModel?.maxRangeKm,
      dto.vehicleModel?.maxSpeedKmh,
      "",
      "unknown",
      this.mapRentalPricingFromStaffResponse(dto.rentalPricing),
      new Date()
    );

    return new Vehicle(
      dto.id,
      dto.licensePlate,
      dto.color,
      dto.currentOdometerKm,
      dto.batteryHealthPercentage,
      dto.status,
      "",
      "unknown",
      dto.vehicleModel?.id,
      undefined, // branch - Not needed
      vehicleModel,
      [],
      [],
      [],
      undefined,
      undefined,
      dto.nextMaintenanceDue ? new Date(dto.nextMaintenanceDue) : undefined,
      dto.fileUrl,
      undefined,
      new Date()
    );
  }

  private mapRentalPricingFromStaffResponse(
    dto: RentalPricingBookingResponse
  ): RentalPricing {
    return new RentalPricing(
      dto.id,
      dto.rentalPrice,
      dto.excessKmPrice,
      [],
      new Date(),
      null,
      null,
      false
    );
  }
}
