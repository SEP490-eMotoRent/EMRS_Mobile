import { ReceiptRepository } from "../../../domain/repositories/receipt/ReceiptRepository";
import { CreateHandoverReceiptUseCaseInput } from "../../../domain/usecases/receipt/CreateHandoverReceiptUseCase";
import { ReceiptRemoteDataSource } from "../../datasources/interfaces/remote/receipt/ReceiptRemoteDataSource";
import { CreateHandoverReceiptRequest } from "../../models/receipt/CreateHandoverReceiptRequest";

export class ReceiptRepositoryImpl implements ReceiptRepository {
    constructor(private remote: ReceiptRemoteDataSource) {}

    async createHandoverReceipt(input: CreateHandoverReceiptUseCaseInput): Promise<void> {
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

        await this.remote.createHandoverReceipt(request);
    }
}

