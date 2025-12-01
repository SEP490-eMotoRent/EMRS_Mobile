import { ApiResponse } from "../../../core/network/APIResponse";
import { RentalReturnRepository } from "../../../domain/repositories/rentalReturn/RentalReturnRepository";
import { RentalReturnCreateReceiptUseCaseInput } from "../../../domain/usecases/rentalReturn/CreateReceiptUseCase";
import { AiAnalyzeUseCaseInput } from "../../../domain/usecases/rentalReturn/AiAnalyzeUseCase";
import { RentalReturnRemoteDataSource } from "../../datasources/interfaces/remote/rentalReturn/RentalReturnRemoteDataSource";
import { AnalyzeReturnRequest } from "../../models/rentalReturn/AnalyzeReturnRequest";
import { AnalyzeReturnResponse } from "../../models/rentalReturn/AnalyzeReturnResponse";
import { CreateReceiptRequest } from "../../models/rentalReturn/CreateReceiptRequest";
import { CreateReceiptResponse } from "../../models/rentalReturn/CreateReceiptResponse";
import { SummaryResponse } from "../../models/rentalReturn/SummaryResponse";
import { FinalizeReturnRequest } from "../../models/rentalReturn/FinalizeReturnRequest";
import { FinalizeReturnResponse } from "../../models/rentalReturn/FinalizeReturnResponse";

export class RentalReturnRepositoryImpl implements RentalReturnRepository {
  constructor(private remote: RentalReturnRemoteDataSource) {}

  async analyzeReturn(
    input: AiAnalyzeUseCaseInput
  ): Promise<ApiResponse<AnalyzeReturnResponse>> {
    const request: AnalyzeReturnRequest = {
      bookingId: input.bookingId,
      returnImages: input.returnImages.map(
        (uri, index) =>
          ({
            uri,
            type: "image/jpeg",
            name: `return_${Date.now()}_${index}.jpg`,
          } as any)
      ),
    };

    return await this.remote.analyzeReturn(request);
  }

  async createReceipt(
    input: RentalReturnCreateReceiptUseCaseInput
  ): Promise<ApiResponse<CreateReceiptResponse>> {
    const request: CreateReceiptRequest = {
      bookingId: input.bookingId,
      actualReturnDatetime: input.actualReturnDatetime,
      endOdometerKm: input.endOdometerKm,
      endBatteryPercentage: input.endBatteryPercentage,
      notes: input.notes,
      returnImageUrls: input.returnImageUrls,
      checkListImage: {
        uri: input.checkListImage,
        type: "image/png",
        name: `checklist_${Date.now()}.png`,
      } as any,
    };

    return await this.remote.createReceipt(request);
  }

  async getSummary(bookingId: string): Promise<ApiResponse<SummaryResponse>> {
    return await this.remote.getSummary(bookingId);
  }

  async finalizeReturn(request: FinalizeReturnRequest): Promise<ApiResponse<FinalizeReturnResponse>> {
    return await this.remote.finalizeReturn(request);
  }
}
