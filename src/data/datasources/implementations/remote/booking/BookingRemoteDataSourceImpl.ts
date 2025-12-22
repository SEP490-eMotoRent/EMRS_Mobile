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
import { BookingDetailResponse } from "../../../../models/booking/BookingDetailResponse";
import { VNPayCallback } from "../../../../models/booking/vnpay/VNPayCallback";
import { BookingRemoteDataSource } from "../../../interfaces/remote/booking/BookingRemoteDataSource";
import { BookingResponse } from "../../../../models/booking/BookingResponse";
import { AssignVehicleResponse } from "../../../../models/booking/AssignVehicleResponse";
import { ZaloPayCallbackRequest } from "../../../../models/booking/zalo/ZaloPayCallbackRequest";

export class BookingRemoteDataSourceImpl implements BookingRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async create(request: CreateBookingRequest): Promise<BookingResponseForRenter> {
    // console.log(
    //   "📤 Original booking request:",
    //   JSON.stringify(request, null, 2)
    // );

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

    // console.log(
    //   "📤 Cleaned booking request (null for optional Guid):",
    //   JSON.stringify(cleanedRequest, null, 2)
    // );

    try {
      const response =
        await this.axiosClient.post<ApiResponse<BookingResponseForRenter>>(
          ApiEndpoints.booking.create,
          cleanedRequest
        );

      // console.log(
      //   "📥 Booking API response:",
      //   JSON.stringify(response.data, null, 2)
      // );

      return unwrapResponse(response.data);
    } catch (error: any) {
      // console.error("❌ [CREATE BOOKING] API Error:", error);
      // console.error(
      //   "❌ Error Response:",
      //   JSON.stringify(error.response?.data, null, 2)
      // );
      // console.error(
      //   "❌ Request that failed:",
      //   JSON.stringify(cleanedRequest, null, 2)
      // );
      throw error;
    }
  }

  async createVNPay(
    request: CreateBookingRequest
  ): Promise<BookingWithoutWalletResponse> {
    // console.log("📤 VNPay booking request:", JSON.stringify(request, null, 2));

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
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.booking.createVNPay,
        cleanedRequest
      );

      const rawData = unwrapResponse(response.data);
      // console.log(
      //   "📥 Raw VNPay response from backend:",
      //   JSON.stringify(rawData, null, 2)
      // );

      const transformedData: BookingWithoutWalletResponse = {
        id: rawData.id || rawData.Id,
        vehicleModelId: rawData.vehicleModelId || rawData.VehicleModelId,
        renterId: rawData.renterId || rawData.RenterId,
        vehicleId: rawData.vehicleId || rawData.VehicleId,
        startDatetime: rawData.startDatetime || rawData.StartDatetime,
        endDatetime: rawData.endDatetime || rawData.EndDatetime,
        actualReturnDatetime:
          rawData.actualReturnDatetime || rawData.ActualReturnDatetime,
        baseRentalFee: rawData.baseRentalFee ?? rawData.BaseRentalFee,
        depositAmount: rawData.depositAmount ?? rawData.DepositAmount,
        rentalDays: rawData.rentalDays ?? rawData.RentalDays,
        rentalHours: rawData.rentalHours ?? rawData.RentalHours,
        rentingRate: rawData.rentingRate ?? rawData.RentingRate,
        lateReturnFee:
          rawData.lateReturnFee ?? rawData.LateReturnFee ?? 0,
        averageRentalPrice:
          rawData.averageRentalPrice ?? rawData.AverageRentalPrice,
        totalRentalFee:
          rawData.totalRentalFee ?? rawData.TotalRentalFee,
        totalAmount: rawData.totalAmount ?? rawData.TotalAmount,
        bookingStatus:
          rawData.bookingStatus || rawData.BookingStatus,
        vnpayUrl:
          rawData.vnpayurl ||
          rawData.VNPAYURL ||
          rawData.vnpayUrl ||
          rawData.VnpayUrl,
      };

      // console.log(
      //   "✅ Transformed response:",
      //   JSON.stringify(transformedData, null, 2)
      // );

      if (!transformedData.vnpayUrl) {
        // console.error("❌ Missing VNPay URL in response!");
        throw new Error("VNPay URL not found in backend response");
      }

      return transformedData;
    } catch (error: any) {
      // console.error("❌ [CREATE VNPAY BOOKING] API Error:", error);
      // console.error(
      //   "❌ Error Response:",
      //   JSON.stringify(error.response?.data, null, 2)
      // );

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create VNPay booking";

      throw new Error(errorMessage);
    }
  }

  async getById(id: string): Promise<BookingDetailResponse | null> {
    try {
      const endpoint = ApiEndpoints.booking.detail(id);
      const response =
        await this.axiosClient.get<ApiResponse<BookingDetailResponse>>(
          endpoint
        );
      return unwrapResponse(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      // console.error("Failed to fetch booking:", error);
      return null;
    }
  }

  async confirmVNPayPayment(request: VNPayCallback): Promise<void> {
    // console.log("Calling VNPay callback API:", request);

    try {
      const response = await this.axiosClient.put<ApiResponse<boolean>>(
        ApiEndpoints.booking.vnpayCallback,
        request
      );
      unwrapResponse(response.data);

      // console.log("VNPay callback confirmed");
    } catch (error: any) {
      // console.error("VNPay callback failed:", error);
      throw error;
    }
  }

  async getByRenter(renterId: string): Promise<BookingResponseForRenter[]> {
    try {
      const endpoint = ApiEndpoints.booking.byRenter(renterId);
      const response =
        await this.axiosClient.get<
          ApiResponse<BookingResponseForRenter[]>
        >(endpoint);
      return unwrapResponse(response.data);
    } catch (error: any) {
      // console.error("Failed to fetch renter bookings:", error);
      return [];
    }
  }

  async getCurrentRenterBookings(): Promise<BookingResponseForRenter[]> {
    try {
      // console.log(
      //   "🌐 Calling API:",
      //   ApiEndpoints.booking.byCurrentRenter
      // );
      const response =
        await this.axiosClient.get<
          ApiResponse<BookingResponseForRenter[]>
        >(ApiEndpoints.booking.byCurrentRenter);
      const result = unwrapResponse(response.data);
      // console.log("✅ API returned bookings:", result.length);
      return result;
    } catch (error: any) {
      // console.error("❌ Failed to fetch current renter bookings:", error);
      return [];
    }
  }

  async getBookings(
    vehicleModelId: string,
    renterId: string,
    bookingStatus: string,
    date: string,
    pageNum: number,
    pageSize: number,
    branchId?: string
  ): Promise<PaginatedBookingResponse> {
    try {
      const response =
        await this.axiosClient.get<
          ApiResponse<PaginatedBookingResponse>
        >(ApiEndpoints.booking.list, {
          params: {
            vehicleModelId,
            renterId,
            bookingStatus,
            date,
            pageNum,
            pageSize,
            branchId,
          },
        });
      return unwrapResponse(response.data);
    } catch (error: any) {
      // console.error("Failed to fetch bookings:", error);
      return {
        currentPage: 1,
        pageSize,
        totalItems: 0,
        totalPages: 0,
        items: [],
      };
    }
  }

  async assignVehicle(
    vehicleId: string,
    bookingId: string
  ): Promise<ApiResponse<AssignVehicleResponse>> {
    try {
      const endpoint = ApiEndpoints.booking.assignVehicle(
        vehicleId,
        bookingId
      );
      const response =
        await this.axiosClient.put<
          ApiResponse<AssignVehicleResponse>
        >(endpoint);
      return {
        success: true,
        message: "Vehicle assigned to booking successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      // console.error("Failed to assign vehicle to booking:", error);
      throw error;
    }
  }

  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    try {
      // console.log(
      //   "📤 [CANCEL BOOKING] Calling API for booking:",
      //   bookingId
      // );
      const endpoint = ApiEndpoints.booking.cancel(bookingId);
      const response =
        await this.axiosClient.put<ApiResponse<BookingResponse>>(
          endpoint
        );

      const cancelledBooking = unwrapResponse(response.data);
      // console.log(
      //   "✅ [CANCEL BOOKING] Booking cancelled successfully:",
      //   cancelledBooking.id
      // );
      // console.log("   Status:", cancelledBooking.bookingStatus);

      return cancelledBooking;
    } catch (error: any) {
      // console.error("❌ [CANCEL BOOKING] API Error:", error);
      // console.error(
      //   "❌ Error Response:",
      //   JSON.stringify(error.response?.data, null, 2)
      // );

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to cancel booking";

      throw new Error(errorMessage);
    }
  }

  async createZaloPay(
    request: CreateBookingRequest
  ): Promise<BookingWithoutWalletResponse> {
    // console.log(
    //   "📤 ZaloPay booking request:",
    //   JSON.stringify(request, null, 2)
    // );

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
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.booking.createZaloPay,
        cleanedRequest
      );

      const rawData = unwrapResponse(response.data);
      // console.log(
      //   "📥 Raw ZaloPay response from backend:",
      //   JSON.stringify(rawData, null, 2)
      // );

      const transformedData: BookingWithoutWalletResponse = {
        id: rawData.id || rawData.Id,
        vehicleModelId: rawData.vehicleModelId || rawData.VehicleModelId,
        renterId: rawData.renterId || rawData.RenterId,
        vehicleId: rawData.vehicleId || rawData.VehicleId,
        startDatetime: rawData.startDatetime || rawData.StartDatetime,
        endDatetime: rawData.endDatetime || rawData.EndDatetime,
        actualReturnDatetime:
          rawData.actualReturnDatetime || rawData.ActualReturnDatetime,
        baseRentalFee: rawData.baseRentalFee ?? rawData.BaseRentalFee,
        depositAmount: rawData.depositAmount ?? rawData.DepositAmount,
        rentalDays: rawData.rentalDays ?? rawData.RentalDays,
        rentalHours: rawData.rentalHours ?? rawData.RentalHours,
        rentingRate: rawData.rentingRate ?? rawData.RentingRate,
        lateReturnFee:
          rawData.lateReturnFee ?? rawData.LateReturnFee ?? 0,
        averageRentalPrice:
          rawData.averageRentalPrice ?? rawData.AverageRentalPrice,
        totalRentalFee:
          rawData.totalRentalFee ?? rawData.TotalRentalFee,
        totalAmount: rawData.totalAmount ?? rawData.TotalAmount,
        bookingStatus:
          rawData.bookingStatus || rawData.BookingStatus,
        vnpayUrl:
          rawData.vnpayurl ||
          rawData.VNPAYURL ||
          rawData.vnpayUrl ||
          rawData.VnpayUrl,
      };

      // console.log(
      //   "✅ Transformed ZaloPay response:",
      //   JSON.stringify(transformedData, null, 2)
      // );

      if (!transformedData.vnpayUrl) {
        // console.error("❌ Missing ZaloPay URL in response!");
        throw new Error("ZaloPay URL not found in backend response");
      }

      return transformedData;
    } catch (error: any) {
      // console.error("❌ [CREATE ZALOPAY BOOKING] API Error:", error);
      // console.error(
      //   "❌ Error Response:",
      //   JSON.stringify(error.response?.data, null, 2)
      // );

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create ZaloPay booking";

      throw new Error(errorMessage);
    }
  }

  async verifyZaloPayPayment(
    request: ZaloPayCallbackRequest
  ): Promise<boolean> {
    try {
      // console.log(
      //   "📤 [ZaloPay Callback] Request:",
      //   JSON.stringify(request, null, 2)
      // );

      const response = await this.axiosClient.post<ApiResponse<boolean>>(
        ApiEndpoints.booking.zaloPayCallback,
        request
      );

      // console.log(
      //   "📥 [ZaloPay Callback] Response:",
      //   JSON.stringify(response.data, null, 2)
      // );

      const result = unwrapResponse(response.data);

      // console.log("✅ [ZaloPay Callback] Success:", result);
      return result;
    } catch (error: any) {
      // console.error("❌ [ZaloPay Callback] Error:", error);
      // console.error(
      //   "❌ Error response:",
      //   JSON.stringify(error.response?.data, null, 2)
      // );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify ZaloPay payment";

      throw new Error(errorMessage);
    }
  }
}
