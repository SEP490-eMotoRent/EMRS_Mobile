import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import {
  ApiResponse,
  unwrapResponse,
} from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { BookingResponse } from "../../../../models/booking/BookingResponse";
import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { PaginatedBookingResponse } from "../../../../models/booking/PaginatedBookingResponse";
import { BookingForStaffResponse } from "../../../../models/booking/staffResponse/BookingResponseForStaff";
import { BookingRemoteDataSource } from "../../../interfaces/remote/booking/BookingRemoteDataSource";

export class BookingRemoteDataSourceImpl implements BookingRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async create(request: CreateBookingRequest): Promise<BookingResponse> {
    console.log(
      "Sending booking request to API:",
      JSON.stringify(request, null, 2)
    );

    const response = await this.axiosClient.post<ApiResponse<BookingResponse>>(
      ApiEndpoints.booking.create,
      request
    );

    console.log(
      "Booking API response:",
      JSON.stringify(response.data, null, 2)
    );
    return unwrapResponse(response.data);
  }

  async getById(id: string): Promise<BookingForStaffResponse | null> {
    try {
      const endpoint = ApiEndpoints.booking.detail(id);
      const response = await this.axiosClient.get<
        ApiResponse<BookingForStaffResponse>
      >(endpoint);
      return unwrapResponse(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error("Failed to fetch booking:", error);
      return null;
    }
  }

  async getByRenter(renterId: string): Promise<BookingResponse[]> {
    try {
      const endpoint = ApiEndpoints.booking.byRenter(renterId);
      // ✅ UPDATED: Returns BookingResponse (renter response) not staff response
      const response = await this.axiosClient.get<
        ApiResponse<BookingResponse[]>
      >(endpoint);
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("Failed to fetch renter bookings:", error);
      return [];
    }
  }

  async getCurrentRenterBookings(): Promise<BookingResponse[]> {
    try {
      console.log("🌐 Calling API:", ApiEndpoints.booking.byCurrentRenter);
      // ✅ UPDATED: Returns BookingResponse[] (BookingListForRenterResponse[])
      const response = await this.axiosClient.get<
        ApiResponse<BookingResponse[]>
      >(ApiEndpoints.booking.byCurrentRenter);
      const result = unwrapResponse(response.data);
      console.log("✅ API returned bookings:", result.length);
      return result;
    } catch (error: any) {
      console.error("❌ Failed to fetch current renter bookings:", error);
      return [];
    }
  }

  async getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    pageNum: number,
    pageSize: number
  ): Promise<PaginatedBookingResponse> {
    try {
      const response = await this.axiosClient.get<
        ApiResponse<PaginatedBookingResponse>
      >(ApiEndpoints.booking.list, {
        params: {
          vehicleModelId,
          renterId,
          bookingStatus,
          pageNum,
          pageSize,
        },
      });
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("Failed to fetch bookings:", error);
      return {
        currentPage: 1,
        pageSize,
        totalItems: 0,
        totalPages: 0,
        items: [],
      };
    }
  }

  async assignVehicle(vehicleId: string, bookingId: string): Promise<void> {
    try {
      const endpoint = ApiEndpoints.booking.assignVehicle(vehicleId, bookingId);
      const response = await this.axiosClient.put<ApiResponse<void>>(endpoint);
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("Failed to assign vehicle to booking:", error);
      throw error;
    }
  }
}