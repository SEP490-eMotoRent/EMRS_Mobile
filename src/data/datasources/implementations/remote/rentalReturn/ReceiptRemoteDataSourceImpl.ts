import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { AnalyzeReturnRequest } from "../../../../models/rentalReturn/AnalyzeReturnRequest";
import { AnalyzeReturnResponse } from "../../../../models/rentalReturn/AnalyzeReturnResponse";
import { CreateReceiptRequest } from "../../../../models/rentalReturn/CreateReceiptRequest";
import { CreateReceiptResponse } from "../../../../models/rentalReturn/CreateReceiptResponse";
import { FinalizeReturnRequest } from "../../../../models/rentalReturn/FinalizeReturnRequest";
import { FinalizeReturnResponse } from "../../../../models/rentalReturn/FinalizeReturnResponse";
import { SummaryResponse } from "../../../../models/rentalReturn/SummaryResponse";
import { UpdateReturnReceiptRequest } from "../../../../models/rentalReturn/UpdateReturnReceiptRequest";
import { VehicleSwapRequest } from "../../../../models/rentalReturn/VehicleSwapRequest";
import { VehicleSwapResponse } from "../../../../models/rentalReturn/VehicleSwapResponse";
import { RentalReturnRemoteDataSource } from "../../../interfaces/remote/rentalReturn/RentalReturnRemoteDataSource";

export class RentalReturnRemoteDataSourceImpl
  implements RentalReturnRemoteDataSource
{
  constructor(private axiosClient: AxiosClient) {}

  async analyzeReturn(
    request: AnalyzeReturnRequest
  ): Promise<ApiResponse<AnalyzeReturnResponse>> {
    try {
      const formData = new FormData();

      formData.append("BookingId", request.bookingId);

      // Add vehicle files
      request.returnImages.forEach((file, index) => {
        formData.append("ReturnImages", file);
      });

      const response = await this.axiosClient.post<
        ApiResponse<AnalyzeReturnResponse>
      >(ApiEndpoints.rentalReturn.analyzeReturn, formData);

      return {
        success: true,
        message: "Return analyzed successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error analyzing return:", error);
      throw error;
    }
  }

  async createReceipt(
    request: CreateReceiptRequest
  ): Promise<ApiResponse<CreateReceiptResponse>> {
    try {
      const formData = new FormData();

      formData.append("BookingId", request.bookingId);
      formData.append("RentalReceiptId", request.returnReceiptId);
      formData.append("ActualReturnDatetime", request.actualReturnDatetime);
      formData.append("EndOdometerKm", request.endOdometerKm.toString());
      formData.append(
        "EndBatteryPercentage",
        request.endBatteryPercentage.toString()
      );
      formData.append("Notes", request.notes);
      formData.append(
        "ReturnImageUrls",
        JSON.stringify(request.returnImageUrls)
      );
      formData.append("ChecklistImage", request.checkListImage);

      console.log("=== FormData Content ===");
      (formData as any)._parts.forEach(([key, value]: [string, any]) => {
        console.log(`${key}:`, value);
      });
      const response = await this.axiosClient.post<
        ApiResponse<CreateReceiptResponse>
      >(ApiEndpoints.rentalReturn.createReceipt, formData);

      return {
        success: true,
        message: "Receipt created successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error creating receipt:", error);
      throw error;
    }
  }

  async getSummary(bookingId: string): Promise<ApiResponse<SummaryResponse>> {
    try {
      const response = await this.axiosClient.get<ApiResponse<SummaryResponse>>(
        ApiEndpoints.rentalReturn.summary(bookingId)
      );
      return {
        success: true,
        message: "Summary retrieved successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error getting summary:", error);
      throw error;
    }
  }

  async finalizeReturn(
    request: FinalizeReturnRequest
  ): Promise<ApiResponse<FinalizeReturnResponse>> {
    try {
      const response = await this.axiosClient.put<
        ApiResponse<FinalizeReturnResponse>
      >(ApiEndpoints.rentalReturn.finalizeReturn, {
        bookingId: request.bookingId,
        renterConfirmed: request.renterConfirmed,
      });
      console.log("response", response);

      return {
        success: true,
        message: "Return finalized successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error finalizing return:", error);
      throw error;
    }
  }

  async swapVehicleReturn(
    request: VehicleSwapRequest
  ): Promise<ApiResponse<VehicleSwapResponse>> {
    try {
      const formData = new FormData();

      formData.append("BookingId", request.bookingId);
      formData.append("RentalReceiptId", request.returnReceiptId);
      formData.append("EndOdometerKm", request.endOdometerKm.toString());
      formData.append(
        "EndBatteryPercentage",
        request.endBatteryPercentage.toString()
      );
      formData.append("Notes", request.notes);
      formData.append(
        "ReturnImageUrls",
        JSON.stringify(request.returnImageUrls)
      );
      formData.append("ChecklistImage", request.checkListImage);

      console.log("=== FormData Content ===");
      (formData as any)._parts.forEach(([key, value]: [string, any]) => {
        console.log(`${key}:`, value);
      });
      const response = await this.axiosClient.post<
        ApiResponse<VehicleSwapResponse>
      >(ApiEndpoints.rentalReturn.vehicleSwap, formData);

      return {
        success: true,
        message: "Vehicle swapped successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error swapping vehicle:", error);
      throw error;
    }
  }

  async updateReturnReceipt(
    request: UpdateReturnReceiptRequest
  ): Promise<ApiResponse<void>> {
    try {
      const formData = new FormData();

      formData.append("BookingId", request.bookingId);
      formData.append("RentalReceiptId", request.rentalReceiptId);
      formData.append("ActualReturnDatetime", request.actualReturnDatetime);
      formData.append("EndOdometerKm", request.endOdometerKm.toString());
      formData.append(
        "EndBatteryPercentage",
        request.endBatteryPercentage.toString()
      );
      formData.append("Notes", request.notes);
      request.returnImageUrls.forEach((file, index) => {
        formData.append("ReturnImageUrls", file);
      });
      formData.append("ChecklistImage", request.checkListImage);

      console.log("=== FormData Content ===");
      (formData as any)._parts.forEach(([key, value]: [string, any]) => {
        console.log(`${key}:`, value);
      });
      const response = await this.axiosClient.put<
        ApiResponse<void>
      >(ApiEndpoints.rentalReturn.updateReturnReceipt, formData);
      return {
        success: true,
        message: "Return receipt updated successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error updating return receipt:", error);
      throw error;
    }
  }
}
