import { Booking } from "../../../domain/entities/booking/Booking";
import { PaginatedBooking } from "../../../domain/entities/booking/PaginatedBooking";
import { Renter } from "../../../domain/entities/account/Renter";
import { Vehicle } from "../../../domain/entities/vehicle/Vehicle";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import { Branch } from "../../../domain/entities/operations/Branch";
import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { Account } from "../../../domain/entities/account/Account";
import { Membership } from "../../../domain/entities/financial/Membership";
import { BookingRepository } from "../../../domain/repositories/booking/BookingRepository";
import { BookingRemoteDataSource } from "../../datasources/interfaces/remote/booking/BookingRemoteDataSource";
import { CreateBookingRequest } from "../../models/booking/CreateBookingRequest";
import { BookingResponse } from "../../models/booking/BookingResponse";

export class BookingRepositoryImpl implements BookingRepository {
  constructor(private remote: BookingRemoteDataSource) {}

  async create(booking: Booking): Promise<Booking> {
    const request: CreateBookingRequest = {
      startDatetime:
        booking.startDatetime?.toISOString() || new Date().toISOString(),
      endDatetime:
        booking.endDatetime?.toISOString() || new Date().toISOString(),
      baseRentalFee: booking.baseRentalFee,
      depositAmount: booking.depositAmount,
      rentalDays: booking.rentalDays,
      rentalHours: booking.rentalHours,
      rentingRate: booking.rentingRate,
      vehicleModelId: booking.vehicleId,
      averageRentalPrice: booking.averageRentalPrice,
      totalRentalFee: booking.totalRentalFee,
    };

    const response = await this.remote.create(request);
    return this.mapToEntity(response);
  }

  async getById(id: string): Promise<Booking | null> {
    const response = await this.remote.getById(id);
    return response ? this.mapToEntity(response) : null;
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
    const response = await this.remote.getBookings(
      vehicleModelId,
      renterId,
      bookingStatus,
      pageNum,
      pageSize
    );

    return {
      currentPage: response.currentPage,
      pageSize: response.pageSize,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
      items: response.items.map((item) => this.mapToEntity(item)),
    };
  }

  private mapToEntity(dto: BookingResponse): Booking {
    const mockAccount = new Account(
      dto.renter?.account?.id || "unknown",
      dto.renter?.account?.username || "",
      "",
      dto.renter?.account?.role || "RENTER",
      dto.renter?.account?.fullname || "",
      undefined,
      undefined,
      undefined,
      undefined,
    );

    const mockMembership = new Membership(
      "mock-membership-id",
      "Basic",
      0,
      0,
      0,
      "",
      [],
      new Date(),
      null,
      null,
      false
    );

    const mockRenter = new Renter(
      dto.renter?.id || "unknown",
      dto.renter?.email || "",
      dto.renter?.phone || "",
      dto.renter?.address || "",
      "",
      "",
      "",
      mockAccount,
      mockMembership,
      false,
      "",
      undefined,
      undefined
    );

    const mockRentalPricing = new RentalPricing(
      "mock-pricing-id",
      0,
      0,
      [],
      new Date(),
      null,
      null,
      false
    );

    const mockVehicleModel = new VehicleModel(
      dto.vehicle?.vehicleModel?.id || "unknown",
      dto.vehicle?.vehicleModel?.modelName || "",
      dto.vehicle?.vehicleModel?.category || "",
      dto.vehicle?.vehicleModel?.batteryCapacityKwh || 0,
      dto.vehicle?.vehicleModel?.maxRangeKm || 0,
      dto.vehicle?.vehicleModel?.maxSpeedKmh || 0,
      "",
      "",
      mockRentalPricing,
      new Date(),
      null,
      null,
      false
    );

    const mockBranch = new Branch(
      "mock-branch-id",
      "",
      "",
      "",
      "",
      "",
      0,
      0,
      "09:00",
      "18:00",
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      new Date(),
      null,
      null,
      false
    );

    const mockVehicle = new Vehicle(
      dto.vehicle?.id || undefined,
      dto.vehicle?.licensePlate || "",
      dto.vehicle?.color || "",
      dto.vehicle?.currentOdometerKm || 0,
      dto.vehicle?.batteryHealthPercentage || 0,
      dto.vehicle?.status || "",
      "",
      "",
      "",
      mockBranch,
      mockVehicleModel,
      [],
      [],
      [],
      undefined,
      undefined,
      undefined,
      dto.vehicle?.fileUrl,
      undefined,
      new Date(),
      null,
      null,
      false
    );

    // ✅ FIXED: Use dto.id instead of dto.bookingId
    return new Booking(
      dto.id, // ✅ CHANGED FROM dto.bookingId
      dto.baseRentalFee,
      dto.depositAmount,
      dto.rentalDays,
      dto.rentalHours,
      dto.rentingRate,
      0,
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
      dto.renter?.id || "unknown",
      dto.vehicle?.id || "unknown",
      mockRenter,
      mockVehicle,
      new Date(dto.startDatetime),
      new Date(dto.endDatetime),
      undefined,
      dto.insurancePackageId,
      undefined,
      dto.handoverBranchId,
      undefined,
      dto.returnBranchId,
      undefined,
      new Date(dto.createdAt),
      null,
      null,
      false
    );
  }
}
