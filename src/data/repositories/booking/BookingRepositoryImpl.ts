import { Booking } from "../../../domain/entities/booking/Booking";
import { BookingRepository } from "../../../domain/repositories/booking/BookingRepository";
import { BookingRemoteDataSource } from "../../datasources/interfaces/remote/booking/BookingRemoteDataSource";
import { CreateBookingRequest } from "../../models/booking/CreateBookingRequest";
import { PaginatedBooking } from "../../models/booking/PaginatedBooking";
import {
  AccountBookingResponse,
  BookingForStaffResponse,
  RentalContractBookingResponse,
  RentalPricingBookingResponse,
  RenterBookingResponse,
  VehicleBookingResponse,
  VehicleModelBookingResponse,
} from "../../models/booking/staffResponse/BookingResponseForStaff";
import { Renter } from "../../../domain/entities/account/Renter";
import { Vehicle } from "../../../domain/entities/vehicle/Vehicle";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { Branch } from "../../../domain/entities/operations/Branch";
import { BookingResponse } from "../../models/booking/BookingResponse";
import { PaginatedBookingResponse } from "../../models/booking/PaginatedBookingResponse";
import { Account } from "../../../domain/entities/account/Account";
import { RentalContract } from "../../../domain/entities/booking/RentalContract";

export class BookingRepositoryImpl implements BookingRepository {
  constructor(private remote: BookingRemoteDataSource) {}

  // =========================================================================
  // CREATE
  // =========================================================================
  async create(booking: Booking): Promise<Booking> {
    const request: CreateBookingRequest = {
      startDatetime: booking.startDatetime?.toISOString(),
      endDatetime: booking.endDatetime?.toISOString(),
      baseRentalFee: booking.baseRentalFee,
      depositAmount: booking.depositAmount,
      rentalDays: booking.rentalDays,
      rentalHours: booking.rentalHours,
      rentingRate: booking.rentingRate,
      vehicleModelId: booking.vehicleModelId,
      averageRentalPrice: booking.averageRentalPrice,
      totalRentalFee: booking.totalRentalFee,
    };

    const response = await this.remote.create(request);
    return this.mapToEntity(response);
  }

  // =========================================================================
  // READ
  // =========================================================================
  async getById(id: string): Promise<Booking | null> {
    const response = await this.remote.getById(id);
    return response ? this.mapToEntity(response) : null;
  }

  async getByIdForStaff(id: string): Promise<Booking | null> {
    const response = await this.remote.getById(id);
    return response ? this.mapStaffResponseToEntity(response) : null;
  }

  async getByRenter(renterId: string): Promise<Booking[]> {
    const responses = await this.remote.getByRenter(renterId);
    return responses.map((r) => this.mapToEntity(r));
  }

  async getCurrentRenterBookings(): Promise<Booking[]> {
    const responses = await this.remote.getCurrentRenterBookings();
    return responses.map((r) => this.mapToEntity(r));
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
      return this.mapSimpleResponseToEntity(item);
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
    return "renter" in item && "vehicle" in item;
  }

  // =========================================================================
  // MAP SIMPLE RESPONSE (BookingResponse - only IDs)
  // =========================================================================
  private mapSimpleResponseToEntity(dto: BookingResponse): Booking {
    const mockRenter = this.createMockRenter(dto.renterId);
    const mockVehicleModel = this.createMockVehicleModel(dto.vehicleModelId);
    const mockVehicle = dto.vehicleId
      ? this.createMockVehicle(dto.vehicleId, dto.vehicleModelId)
      : undefined;

    return new Booking(
      dto.id,
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
      dto.vehicleModelId, // REQUIRED
      dto.renterId, // REQUIRED
      mockRenter, // REQUIRED
      mockVehicleModel, // REQUIRED
      dto.vehicleId, // optional
      mockVehicle, // optional
      dto.startDatetime ? new Date(dto.startDatetime) : undefined,
      dto.endDatetime ? new Date(dto.endDatetime) : undefined,
      dto.actualReturnDatetime ? new Date(dto.actualReturnDatetime) : undefined,
      undefined, // insurancePackageId
      undefined, // insurancePackage
      undefined, // rentalContract
      undefined, // handoverBranchId
      undefined, // handoverBranch
      undefined, // returnBranchId
      undefined, // returnBranch
      new Date(),
      null,
      null,
      false
    );
  }

  // =========================================================================
  // MAP STAFF RESPONSE (BookingForStaffResponse - nested)
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

    return new Booking(
      dto?.id,
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
      vehicleModel?.id ?? "unknown-model",
      renter?.id ?? "unknown-renter", // renterId
      renter, // REQUIRED
      vehicleModel, // REQUIRED
      vehicle?.id, // vehicleId
      vehicle, // vehicle
      dto.startDatetime ? new Date(dto.startDatetime) : undefined,
      dto.endDatetime ? new Date(dto.endDatetime) : undefined,
      dto.actualReturnDatetime ? new Date(dto.actualReturnDatetime) : undefined,
      undefined, // insurancePackageId
      undefined, // insurancePackage
      rentalContract, // rentalContract
      undefined, // handoverBranchId
      undefined, // handoverBranch
      undefined, // returnBranchId
      undefined, // returnBranch
      new Date(),
      null,
      null,
      false
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

  // =========================================================================
  // MAPPERS: Renter (aligned with C# backend)
  // =========================================================================
  private mapRenterFromStaffResponse(dto: RenterBookingResponse): Renter {
    return new Renter(
      dto.id,
      dto.email || "",
      dto.phone || "",
      dto.address || "",
      dto.account?.id || "unknown-account", // accountId
      "unknown", // membershipId (not in DTO)
      false,
      "",
      dto.dateOfBirth,
      undefined,
      "",
      undefined,
      this.mapAccountFromStaffResponse(dto.account)
    );
  }

  // =========================================================================
  // MAPPERS: Vehicle
  // =========================================================================
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

    const mockBranch = this.createMockBranch();

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
      mockBranch,
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

  // =========================================================================
  // MOCK HELPERS (only for simple responses)
  // =========================================================================
  private createMockRenter(id: string): Renter {
    return new Renter(
      id,
      "unknown@email.com",
      "",
      "",
      id, // accountId
      "mock-membership",
      false,
      ""
    );
  }

  private createMockVehicleModel(id: string): VehicleModel {
    return new VehicleModel(
      id,
      "Unknown Model",
      "Unknown",
      0,
      0,
      0,
      "",
      "",
      undefined,
      new Date()
    );
  }

  private createMockVehicle(
    vehicleId: string,
    vehicleModelId: string
  ): Vehicle {
    const mockBranch = this.createMockBranch();
    const mockVehicleModel = this.createMockVehicleModel(vehicleModelId);

    return new Vehicle(
      vehicleId,
      "UNKNOWN",
      "Unknown",
      0,
      100,
      "Available",
      "",
      "unknown",
      vehicleModelId,
      mockBranch,
      mockVehicleModel,
      [],
      [],
      [],
      undefined,
      undefined,
      undefined,
      undefined,
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

  private createMockBranch(): Branch {
    return {
      id: "mock",
      branchName: "Unknown",
      createdAt: new Date(),
    } as Branch;
  }

  // =========================================================================
  // UNIFIED MAPPER
  // =========================================================================
  private mapToEntity(dto: BookingResponse | BookingForStaffResponse): Booking {
    if (this.isStaffResponse(dto)) {
      return this.mapStaffResponseToEntity(dto);
    }
    return this.mapSimpleResponseToEntity(dto);
  }
}
