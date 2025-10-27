
import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { CreateHandoverReceiptRequest } from "../../../../models/receipt/CreateHandoverReceiptRequest";
import { ReceiptRemoteDataSource } from "../../../interfaces/remote/receipt/ReceiptRemoteDataSource";

export class ReceiptRemoteDataSourceImpl implements ReceiptRemoteDataSource {
    constructor(private axiosClient: AxiosClient) {}

    async createHandoverReceipt(request: CreateHandoverReceiptRequest): Promise<ApiResponse<void>> {
        try {
            const formData = new FormData();

            // Add text fields
            formData.append("Notes", request.notes);
            formData.append("StartOdometerKm", request.startOdometerKm.toString());
            formData.append("StartBatteryPercentage", request.startBatteryPercentage.toString());
            formData.append("BookingId", request.bookingId);

            // Add vehicle files
            request.vehicleFiles.forEach((file, index) => {
                formData.append("VehicleFiles", file);
            });

            // Add checklist file
            formData.append("CheckListFile", request.checkListFile);

            const response = await this.axiosClient.post<void>(ApiEndpoints.receipt.create, formData);
            
            return {
                success: true,
                message: "Handover receipt created successfully",
                data: undefined,
                code: response.status,
            };
        } catch (error: any) {
            console.error("Error creating handover receipt:", error);
            throw error;
        }
    }
}

