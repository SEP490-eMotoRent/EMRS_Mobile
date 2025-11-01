import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { CreateReceiptRequest } from "../../../../models/receipt/CreateReceiptRequest";
import { GetContractResponse } from "../../../../models/receipt/GetContractResponse";
import { HandoverReceiptResponse } from "../../../../models/receipt/HandoverReceiptResponse";
import { UpdateReceiptRequest } from "../../../../models/receipt/UpdateReceiptRequest";
import { ReceiptRemoteDataSource } from "../../../interfaces/remote/receipt/ReceiptRemoteDataSource";

export class ReceiptRemoteDataSourceImpl implements ReceiptRemoteDataSource {
  constructor(private axiosClient: AxiosClient) {}

  async createHandoverReceipt(
    request: CreateReceiptRequest
  ): Promise<ApiResponse<HandoverReceiptResponse>> {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("Notes", request.notes);
      formData.append("StartOdometerKm", request.startOdometerKm.toString());
      formData.append(
        "StartBatteryPercentage",
        request.startBatteryPercentage.toString()
      );
      formData.append("BookingId", request.bookingId);

      // Add vehicle files
      request.vehicleFiles.forEach((file, index) => {
        formData.append("VehicleFiles", file);
      });

      // Add checklist file
      formData.append("CheckListFile", request.checkListFile);

      const response = await this.axiosClient.post<
        ApiResponse<HandoverReceiptResponse>
      >(ApiEndpoints.receipt.create, formData);

      return {
        success: true,
        message: "Handover receipt created successfully",
        data: response.data.data,
        code: response.status,
      };
    } catch (error: any) {
      console.error("Error creating handover receipt:", error);
      throw error;
    }
  }

  async updateRentalReceipt(request: UpdateReceiptRequest): Promise<void> {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("RentalReceiptId", request.rentalReceiptId);
      formData.append("EndOdometerKm", request.endOdometerKm.toString());
      formData.append(
        "EndBatteryPercentage",
        request.endBatteryPercentage.toString()
      );

      // Add return vehicle images files
      request.returnVehicleImagesFiles.forEach((file, index) => {
        formData.append("ReturnVehicleImagesFiles", file);
      });

      // Add return checklist file
      formData.append("ReturnCheckListFile", request.returnCheckListFile);
      const response = await this.axiosClient.put<void>(
        ApiEndpoints.receipt.updateRentalReceipt,
        formData
      );
      return response.data;
    }
    catch (error: any) {
      console.error("Error updating rental receipt:", error);
      throw error;
    }
  }

  async generateContract(bookingId: string): Promise<ApiResponse<string>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<string>>(
        ApiEndpoints.receipt.generateContract(bookingId)
      );
      return response.data;
    } catch (error: any) {
      console.error("Error generating contract:", error);
      throw error;
    }
  }

  async getContract(bookingId: string): Promise<ApiResponse<GetContractResponse>> {
    try {
      const response = await this.axiosClient.get<ApiResponse<GetContractResponse>>(
        ApiEndpoints.receipt.getContract(bookingId)
      );
      return response.data;
    } catch (error: any) {
      console.error("Error getting contract:", error);
      throw error;
    }
  }

  async generateOtp(contractId: string): Promise<ApiResponse<string>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<string>>(
        ApiEndpoints.receipt.generateOtp(contractId)
      );
      return response.data;
    } catch (error: any) {
      console.error("Error generating OTP:", error);
      throw error;
    }
  }

  async signContract(contractId: string, otpCode: string): Promise<ApiResponse<string>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<string>>(
        ApiEndpoints.receipt.signContract(contractId, otpCode)
      );
      return response.data;
    } catch (error: any) {
      console.error("Error signing contract:", error);
      throw error;
    }
  }
}
