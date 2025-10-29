import { ApiResponse } from "../../../core/network/APIResponse";
import { RentalContract } from "../../../domain/entities/booking/RentalContract";
import { ReceiptRepository } from "../../../domain/repositories/receipt/ReceiptRepository";
import { CreateHandoverReceiptUseCaseInput } from "../../../domain/usecases/receipt/CreateHandoverReceiptUseCase";
import { ReceiptRemoteDataSource } from "../../datasources/interfaces/remote/receipt/ReceiptRemoteDataSource";
import { CreateHandoverReceiptRequest } from "../../models/receipt/CreateHandoverReceiptRequest";
import { GetContractResponse } from "../../models/receipt/GetContractResponse";
import { HandoverReceiptResponse } from "../../models/receipt/HandoverReceiptResponse";

export class ReceiptRepositoryImpl implements ReceiptRepository {
    constructor(private remote: ReceiptRemoteDataSource) {}

    async createHandoverReceipt(input: CreateHandoverReceiptUseCaseInput): Promise<ApiResponse<HandoverReceiptResponse> > {
        const request: CreateHandoverReceiptRequest = {
            notes: input.notes,
            startOdometerKm: input.startOdometerKm,
            startBatteryPercentage: input.startBatteryPercentage,
            bookingId: input.bookingId,
            vehicleFiles: input.vehicleFiles.map((uri, index) => ({
                uri,
                type: "image/jpeg",
                name: `vehicle_${Date.now()}_${index}.jpg`,
            } as any)),
            checkListFile: {
                uri: input.checkListFile,
                type: "image/png",
                name: `checklist_${Date.now()}.png`,
            } as any,
        };

        return await this.remote.createHandoverReceipt(request);
    }

    async generateContract(bookingId: string): Promise<ApiResponse<string>> {
        return await this.remote.generateContract(bookingId);
    }

    async getContract(bookingId: string): Promise<RentalContract | null> {
        const response = await this.remote.getContract(bookingId);
        return this.mapToEntity(response.data);
    }

    private mapToEntity(dto: GetContractResponse): RentalContract {
        return new RentalContract(
            dto.id,
            dto.contractNumber || "",
            dto.contractTerms || "",
            dto.otpCode,
            dto.contractStatus,
            dto.file,
            undefined,
            undefined,
            undefined,
            new Date(),
            null,
            null,
            false
        );
    }
}

