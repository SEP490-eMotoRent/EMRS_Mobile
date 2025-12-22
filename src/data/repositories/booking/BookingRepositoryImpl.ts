import { ApiResponse } from "../../../core/network/APIResponse";
import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { AdditionalFee } from "../../../domain/entities/booking/AdditionalFee";
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
import { AdditionalFeeResponse } from "../../models/booking/AdditionalFeeResponse";
import { AssignVehicleResponse } from "../../models/booking/AssignVehicleResponse";
import { BookingDetailResponse } from "../../models/booking/BookingDetailResponse";
import { BookingResponse } from "../../models/booking/BookingResponse";
import {
  BookingResponseForRenter,
  InsurancePackageResponse,
  RenterDetailResponse,
  VehicleModelResponse,
  VehicleResponse,
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
import { ZaloPayCallbackRequest } from "../../models/booking/zalo/ZaloPayCallbackRequest";

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
      vnpayUrl: response.vnpayUrl,
    };
  }

  // =========================================================================
  // CREATE ZALOPAY
  // =========================================================================
  async createZaloPay(booking: Booking): Promise<VNPayBookingResult> {
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

    const response = await this.remote.createZaloPay(request);

    console.log(
      "📥 ZaloPay Response from backend:",
      JSON.stringify(response, null, 2)
    );

    // ✅ Validate response has required fields
    if (!response.id || !response.vnpayUrl) {
      console.error("❌ Invalid ZaloPay response:", response);
      throw new Error(
        "Invalid ZaloPay booking response from server - missing id or payment URL"
      );
    }

    console.log("✅ ZaloPay URL extracted:", response.vnpayUrl);

    return {
      booking: this.mapVNPayResponseToEntity(response), // Reuse same mapper
      vnpayUrl: response.vnpayUrl, // This contains the ZaloPay URL
    };
  }

  // =========================================================================
  // READ
  // =========================================================================
  async getById(id: string): Promise<Booking | null> {
    const response = await this.remote.getById(id);
    return response ? this.mapDetailResponseToEntity(response) : null;
  }

  async getByIdForStaff(id: string): Promise<Booking | null> {
    const response = await this.remote.getById(id);
    return response ? this.mapDetailResponseToEntity(response) : null;
  }

  async getByRenter(renterId: string): Promise<Booking[]> {
    const responses = await this.remote.getByRenter(renterId);
    return responses.map((r) => this.mapListResponseToEntity(r));
  }

  async getCurrentRenterBookings(): Promise<Booking[]> {
    const responses = await this.remote.getCurrentRenterBookings();
    // console.log("📦 Repository received responses:", responses.length);
    return responses.map((r) => this.mapListResponseToEntity(r));
  }

  async getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    date: string,
    pageNum: number,
    pageSize: number,
    branchId?: string
  ): Promise<PaginatedBooking> {
    const paginatedResponse: PaginatedBookingResponse =
      await this.remote.getBookings(
        vehicleModelId,
        renterId,
        bookingStatus,
        date,
        pageNum,
        pageSize,
        branchId
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

  // =========================================================================
  // UPDATE
  // =========================================================================
  async assignVehicle(
    vehicleId: string,
    bookingId: string
  ): Promise<ApiResponse<AssignVehicleResponse>> {
    return await this.remote.assignVehicle(vehicleId, bookingId);
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    // console.log("🔄 [REPOSITORY] Cancelling booking:", bookingId);

    const response = await this.remote.cancelBooking(bookingId);

    const cancelledBooking = new Booking(
      response.id,
      response.bookingCode, // ✅ Backend sends bookingCode
      response.baseRentalFee,
      response.depositAmount,
      response.rentalDays,
      response.rentalHours,
      0, // ✅ rentingRate NOT in BookingResponse - set to 0
      response.lateReturnFee || 0,
      response.averageRentalPrice,
      0, // excessKmFee
      0, // cleaningFee
      0, // crossBranchFee
      0, // totalChargingFee
      0, // totalAdditionalFee
      undefined, // earlyHandoverFee
      response.totalRentalFee,
      response.totalAmount,
      0, // refundAmount
      response.bookingStatus,
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

    // console.log(
    //   "✅ [REPOSITORY] Booking cancelled and mapped:",
    //   cancelledBooking.bookingStatus
    // );
    return cancelledBooking;
  }

  // =========================================================================
  // PAYMENT
  // =========================================================================
  async confirmVNPayPayment(request: VNPayCallback): Promise<void> {
    return this.remote.confirmVNPayPayment(request);
  }

  async verifyZaloPayPayment(
    appId: number,
    appTransId: string,
    pmcId: number,
    bankCode: string,
    amount: number,
    discountAmount: number,
    status: number,
    checksum: string
  ): Promise<boolean> {
    try {
      console.log("🔄 [Repository] Verifying ZaloPay payment");
      console.log("📋 Transaction:", appTransId);

      const request: ZaloPayCallbackRequest = {
        AppId: appId,
        AppTransId: appTransId,
        PmcId: pmcId,
        BankCode: bankCode,
        Amount: amount,
        DiscountAmount: discountAmount,
        Status: status,
        Checksum: checksum,
        Message: status === 1 ? "Payment successful" : "Payment failed",
      };

      console.log(
        "📤 [ZaloPay Callback] Request:",
        JSON.stringify(request, null, 2)
      );

      const result = await this.remote.verifyZaloPayPayment(request);

      console.log("✅ [Repository] Verification result:", result);
      return result;
    } catch (error: any) {
      console.error("❌ [Repository] Verification failed:", error);
      throw error;
    }
  }

  // =========================================================================
  // TYPE GUARD
  // =========================================================================
  private isStaffResponse(item: any): item is BookingForStaffResponse {
    return "vehicle" in item && item.vehicle !== undefined;
  }

  // =========================================================================
  // ✅ VNPAY/ZALOPAY MAPPER (Used for both payment methods)
  // =========================================================================
  private mapVNPayResponseToEntity(dto: BookingWithoutWalletResponse): Booking {
    console.log("🔄 Mapping VNPay/ZaloPay booking response:", dto.id);

    return new Booking(
      dto.id,
      "", // ✅ Backend does NOT return BookingCode for VNPay/ZaloPay
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate, // ✅ Backend sends rentingRate
      dto.lateReturnFee || 0,
      dto.averageRentalPrice,
      0, // excessKmFee
      0, // cleaningFee
      0, // crossBranchFee
      0, // totalChargingFee
      0, // totalAdditionalFee
      undefined, // earlyHandoverFee
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
  // ✅ SIMPLE MAPPER (Used for wallet bookings)
  // =========================================================================
  private mapSimpleResponseToEntity(dto: BookingResponseForRenter): Booking {
    // console.log("🔄 Mapping simple booking response:", dto.id);

    const vehicle = dto.vehicle
      ? this.mapVehicleFromListResponse(dto.vehicle)
      : undefined;

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
      dto.bookingCode, // ✅ Backend sends bookingCode
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate, // ✅ Backend sends rentingRate
      dto.lateReturnFee || 0,
      dto.averageRentalPrice,
      0, // excessKmFee
      0, // cleaningFee
      0, // crossBranchFee
      0, // totalChargingFee
      0, // totalAdditionalFee
      undefined, // earlyHandoverFee
      dto.totalRentalFee,
      dto.totalAmount,
      0, // refundAmount
      dto.bookingStatus,
      dto.vehicleModelId,
      dto.renterId,
      renter,
      vehicleModel,
      dto.vehicleId,
      vehicle,
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
  // ✅ LIST MAPPER - WITH NESTED OBJECTS
  // =========================================================================
  private mapListResponseToEntity(dto: BookingResponseForRenter): Booking {
    // console.log("🔄 Mapping list booking response:", dto.id);

    const vehicle = dto.vehicle
      ? this.mapVehicleFromListResponse(dto.vehicle)
      : undefined;

    const vehicleModel = dto.vehicleModel
      ? this.mapVehicleModelFromListResponse(dto.vehicleModel)
      : undefined;

    const renter = dto.renter
      ? this.mapRenterFromListResponse(dto.renter)
      : undefined;

    const insurancePackage = dto.insurancePackage
      ? this.mapInsurancePackageFromResponse(dto.insurancePackage)
      : undefined;

    // ✅ Extract vehicle model image URL
    const vehicleImageUrl = dto.vehicleModelmediaResponse?.fileUrl;

    const booking = new Booking(
      dto.id,
      dto.bookingCode,
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
      undefined, // earlyHandoverFee
      dto.totalRentalFee,
      dto.totalAmount,
      0, // refundAmount
      dto.bookingStatus,
      dto.vehicleModelId,
      dto.renterId,
      renter,
      vehicleModel,
      dto.vehicleId,
      vehicle,
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

    // ✅ Store image URL using any cast
    if (vehicleModel && vehicleImageUrl) {
      (vehicleModel as any).imageUrl = vehicleImageUrl;
    }

    return booking;
  }

  // =========================================================================
  // ✅ DETAIL RESPONSE MAPPER - FULL BOOKING DETAILS WITH ALL FEES
  // =========================================================================
  private mapDetailResponseToEntity(dto: BookingDetailResponse): Booking {
    const renter = dto.renter
      ? this.mapRenterFromStaffResponse(dto.renter)
      : undefined;

    const vehicle = dto.vehicle
      ? this.mapVehicleFromStaffResponse(dto.vehicle)
      : undefined;

    const vehicleModel = dto.vehicleModel
      ? this.mapVehicleModelFromStaffResponse(dto.vehicleModel)
      : undefined;

    const rentalContract = dto.rentalContract
      ? this.mapRentalContractFromStaffResponse(dto.rentalContract)
      : undefined;

    const rentalReceipts = dto.rentalReceipt?.length
      ? dto.rentalReceipt.map((receipt) =>
          this.mapRentalReceiptFromStaffResponse(receipt)
        )
      : [];

    const insurancePackage = dto.insurancePackage
      ? this.mapInsurancePackageFromStaffResponse(dto.insurancePackage)
      : undefined;

    const handoverBranch = dto.handoverBranch
      ? this.mapBranchFromStaffResponse(dto.handoverBranch)
      : undefined;

    const returnBranch = dto.returnBranch
      ? this.mapBranchFromStaffResponse(dto.returnBranch)
      : undefined;

    // ✅ Map additional fees
    const additionalFees = dto.additionalFees?.map((fee) =>
      this.mapAdditionalFeeFromResponse(fee)
    );

    return new Booking(
      dto.id,
      dto.bookingCode, // ✅ Backend sends bookingCode
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate, // ✅ Backend sends rentingRate
      dto.lateReturnFee || 0,
      dto.averageRentalPrice,
      dto.excessKmFee || 0,
      dto.cleaningFee || 0,
      dto.crossBranchFee || 0,
      dto.totalChargingFee || 0,
      dto.totalAdditionalFee || 0,
      dto.earlyHandoverFee,
      dto.totalRentalFee,
      dto.totalAmount,
      dto.refundAmount || 0,
      dto.bookingStatus,
      vehicleModel?.id ?? dto.vehicleModel?.id ?? "unknown-model",
      renter?.id ?? dto.renter?.id ?? "unknown-renter",
      renter,
      vehicleModel,
      vehicle?.id,
      vehicle,
      dto.startDatetime ? new Date(dto.startDatetime) : undefined,
      dto.endDatetime ? new Date(dto.endDatetime) : undefined,
      dto.actualReturnDatetime ? new Date(dto.actualReturnDatetime) : undefined,
      insurancePackage?.id,
      insurancePackage,
      rentalContract,
      rentalReceipts,
      handoverBranch?.id,
      handoverBranch,
      returnBranch?.id,
      returnBranch,
      undefined, // feedback
      undefined, // insuranceClaims
      additionalFees,
      undefined, // chargingRecords
      new Date(),
      null,
      null,
      false
    );
  }

  // =========================================================================
  // ✅ STAFF RESPONSE MAPPER - FOR PAGINATED LISTS
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

    const rentalReceipts = dto.rentalReceipt?.length
      ? dto.rentalReceipt.map((receipt) =>
          this.mapRentalReceiptFromStaffResponse(receipt)
        )
      : [];

    const insurancePackage = dto.insurancePackage
      ? this.mapInsurancePackageFromStaffResponse(dto.insurancePackage)
      : undefined;

    const handoverBranch = dto.handoverBranch
      ? this.mapBranchFromStaffResponse(dto.handoverBranch)
      : undefined;

    // ✅ Map additional fees if present
    const additionalFees = dto.additionalFees?.map((fee) =>
      this.mapAdditionalFeeFromResponse(fee)
    );

    return new Booking(
      dto?.id,
      "", // bookingCode not in staff response
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate,
      dto.lateReturnFee || 0,
      dto.averageRentalPrice,
      dto.excessKmFee || 0,
      dto.cleaningFee || 0,
      dto.crossBranchFee || 0,
      dto.totalChargingFee || 0,
      dto.totalAdditionalFee || 0,
      dto.earlyHandoverFee,
      dto.totalRentalFee,
      dto.totalAmount,
      dto.refundAmount || 0,
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
      insurancePackage?.id,
      insurancePackage,
      rentalContract,
      rentalReceipts,
      handoverBranch?.id,
      handoverBranch,
      undefined, // returnBranchId
      undefined, // returnBranch
      undefined, // feedback
      undefined, // insuranceClaims
      additionalFees,
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

  private mapVehicleFromListResponse(dto: VehicleResponse): Vehicle {
    return new Vehicle(
        dto.id,
        dto.licensePlate,
        dto.color,
        dto.currentOdometerKm,
        dto.batteryHealthPercentage ?? 0,
        dto.status ?? "Unknown",
        dto.description ?? "",
        "unknown", // branchId
        "unknown", // vehicleModelId
        undefined, // branch
        undefined, // vehicleModel
        [], // rentalReceipts
        [], // bookings
        [], // vehicleTransferOrders
        [], // repairRequests
        dto.dateManufacturing ? new Date(dto.dateManufacturing) : undefined,
        dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        undefined, // gpsDeviceIdent
        undefined, // flespiDeviceId
        // ✅ REMOVED dto.fileUrl - not part of entity
        new Date(), // createdAt
        null, // updatedAt
        null, // deletedAt
        false // isDeleted
    );
  }

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
      []
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
      dto.checkListHandoverFile,
      dto.checkListReturnFile,
      dto.bookingId,
      dto.staffId,
      undefined,
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
      undefined,
      vehicleModel,
      [],
      [],
      [],
      [],
      undefined,
      undefined,
      undefined,
      undefined,
      new Date(), // createdAt
      null, // updatedAt
      null, // deletedAt
      false,
      dto.fileUrl
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

  private mapAdditionalFeeFromResponse(
    dto: AdditionalFeeResponse
  ): AdditionalFee {
    return new AdditionalFee(
      dto.id,
      dto.feeType,
      dto.description,
      dto.amount,
      dto.bookingId,
      undefined as any,
      new Date(dto.createdAt),
      null,
      null,
      false
    );
  }
}