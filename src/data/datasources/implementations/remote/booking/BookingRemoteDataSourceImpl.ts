import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import {
  ApiResponse,
  unwrapResponse,
} from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { BookingResponseForRenter } from "../../../../models/booking/BookingResponseForRenter";
import { BookingWithoutWalletResponse } from "../../../../models/booking/BookingWithoutWalletResponse";
import { CreateBookingRequest } from "../../../../models/booking/CreateBookingRequest";
import { PaginatedBookingResponse } from "../../../../models/booking/PaginatedBookingResponse";
import { BookingForStaffResponse } from "../../../../models/booking/staffResponse/BookingResponseForStaff";
import { VNPayCallback } from "../../../../models/booking/vnpay/VNPayCallback";
import { BookingRemoteDataSource } from "../../../interfaces/remote/booking/BookingRemoteDataSource";

export class BookingRemoteDataSourceImpl implements BookingRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async create(request: CreateBookingRequest): Promise<BookingResponseForRenter> {
    console.log(
      "📤 Original booking request:",
      JSON.stringify(request, null, 2)
    );

    const cleanedRequest: Record<string, any> = {
      startDatetime: request.startDatetime,
      endDatetime: request.endDatetime,
      handoverBranchId: request.handoverBranchId,
      baseRentalFee: request.baseRentalFee,
      depositAmount: request.depositAmount,
      rentalDays: request.rentalDays,
      rentalHours: request.rentalHours,
      rentingRate: request.rentingRate,
      vehicleModelId: request.vehicleModelId,
      averageRentalPrice: request.averageRentalPrice,
      totalRentalFee: request.totalRentalFee,
      insurancePackageId: request.insurancePackageId || null,
    };

    console.log(
      "📤 Cleaned booking request (null for optional Guid):",
      JSON.stringify(cleanedRequest, null, 2)
    );

    try {
      const response = await this.axiosClient.post<ApiResponse<BookingResponseForRenter>>(
        ApiEndpoints.booking.create,
        cleanedRequest
      );

      console.log(
        "📥 Booking API response:",
        JSON.stringify(response.data, null, 2)
      );
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("❌ [CREATE BOOKING] API Error:", error);
      console.error("❌ Error Response:", JSON.stringify(error.response?.data, null, 2));
      console.error("❌ Request that failed:", JSON.stringify(cleanedRequest, null, 2));
      throw error;
    }
  }

  // ✅ NEW: VNPay booking creation
  async createVNPay(request: CreateBookingRequest): Promise<BookingWithoutWalletResponse> {
    console.log(
        "📤 VNPay booking request:",
        JSON.stringify(request, null, 2)
    );

    const cleanedRequest: Record<string, any> = {
        startDatetime: request.startDatetime,
        endDatetime: request.endDatetime,
        handoverBranchId: request.handoverBranchId,
        baseRentalFee: request.baseRentalFee,
        depositAmount: request.depositAmount,
        rentalDays: request.rentalDays,
        rentalHours: request.rentalHours,
        rentingRate: request.rentingRate,
        vehicleModelId: request.vehicleModelId,
        averageRentalPrice: request.averageRentalPrice,
        totalRentalFee: request.totalRentalFee,
        insurancePackageId: request.insurancePackageId || null,
    };

    try {
        const response = await this.axiosClient.post<ApiResponse<any>>( // Use 'any' temporarily
            ApiEndpoints.booking.createVNPay,
            cleanedRequest
        );
        
        const rawData = unwrapResponse(response.data);
        console.log("📥 Raw VNPay response from backend:", rawData);
        
        // ✅ Transform backend response field names to match TypeScript interface
        const transformedData: BookingWithoutWalletResponse = {
            id: rawData.id,
            vehicleModelId: rawData.vehicleModelId,
            renterId: rawData.renterId,
            vehicleId: rawData.vehicleId,
            startDatetime: rawData.startDatetime,
            endDatetime: rawData.endDatetime,
            actualReturnDatetime: rawData.actualReturnDatetime,
            baseRentalFee: rawData.baseRentalFee,
            depositAmount: rawData.depositAmount,
            rentalDays: rawData.rentalDays,
            rentalHours: rawData.rentalHours,
            rentingRate: rawData.rentingRate,
            lateReturnFee: rawData.lateReturnFee,
            averageRentalPrice: rawData.averageRentalPrice,
            totalRentalFee: rawData.totalRentalFee,
            totalAmount: rawData.totalAmount,
            bookingStatus: rawData.bookingStatus,
            vnpayUrl: rawData.vnpayurl || rawData.VNPAYURL || rawData.vnpayUrl,
        };
        
        console.log("✅ Transformed response:", transformedData);
        
        // Validate required fields
        if (!transformedData.vnpayUrl) {
            console.error("❌ Missing VNPay URL in response!");
            throw new Error("VNPay URL not found in backend response");
        }
        
        return transformedData;
    } catch (error: any) {
        console.error("❌ [CREATE VNPAY BOOKING] API Error:", error);
        console.error("❌ Error Response:", JSON.stringify(error.response?.data, null, 2));
        
        // Extract meaningful error message
        const errorMessage = error.response?.data?.message 
            || error.response?.data?.error
            || error.message 
            || "Failed to create VNPay booking";
        
        throw new Error(errorMessage);
    }
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

  async confirmVNPayPayment(request: VNPayCallback): Promise<void> {
    console.log("Calling VNPay callback API:", request);

    try {
      const response = await this.axiosClient.put<ApiResponse<boolean>>(
        ApiEndpoints.booking.vnpayCallback,
        request
      );
      unwrapResponse(response.data);

      console.log("VNPay callback confirmed");
    } catch (error: any) {
      console.error("VNPay callback failed:", error);
      throw error;
    }
  }

  async getByRenter(renterId: string): Promise<BookingResponseForRenter[]> {
    try {
      const endpoint = ApiEndpoints.booking.byRenter(renterId);
      const response = await this.axiosClient.get<
        ApiResponse<BookingResponseForRenter[]>
      >(endpoint);
      return unwrapResponse(response.data);
    } catch (error: any) {
      console.error("Failed to fetch renter bookings:", error);
      return [];
    }
  }

  async getCurrentRenterBookings(): Promise<BookingResponseForRenter[]> {
    try {
      console.log("🌐 Calling API:", ApiEndpoints.booking.byCurrentRenter);
      const response = await this.axiosClient.get<
        ApiResponse<BookingResponseForRenter[]>
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