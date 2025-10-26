import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import {
  ApiResponse,
  unwrapResponse,
} from "../../../../../core/network/APIResponse";
import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { BookingResponse } from "../../../../models/booking/BookingResponse";
import { PaginatedBookingResponse } from "../../../../models/booking/PaginatedBookingResponse";
import { BookingRemoteDataSource } from "../../../interfaces/remote/booking/BookingRemoteDataSource";

export class BookingRemoteDataSourceImpl implements BookingRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async create(request: CreateBookingRequest): Promise<BookingResponse> {
    // ✅ Log the request being sent
    console.log(
      "🚀 Sending booking request to API:",
      JSON.stringify(request, null, 2)
    );

    const response = await this.axiosClient.post<ApiResponse<BookingResponse>>(
      ApiEndpoints.booking.create,
      request
    );

    console.log(
      "📥 Booking API response:",
      JSON.stringify(response.data, null, 2)
    );
    return unwrapResponse(response.data);
  }

  async getById(id: string): Promise<BookingResponse | null> {
    try {
      const endpoint = ApiEndpoints.booking.detail(id);
      const response = await this.axiosClient.get<ApiResponse<BookingResponse>>(
        endpoint
      );
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
      const response = await this.axiosClient.get<
        ApiResponse<BookingResponse[]>
      >(ApiEndpoints.booking.byCurrentRenter);
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("Failed to fetch current renter bookings:", error);
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
        vehicleModelId,
        renterId,
        bookingStatus,
        pageNum,
        pageSize,
      });
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("Failed to fetch bookings:", error);
      // Return empty paginated response on error
      return {
        currentPage: 1,
        pageSize: pageSize,
        totalItems: 0,
        totalPages: 0,
        items: [],
      };
    }
  }
}
