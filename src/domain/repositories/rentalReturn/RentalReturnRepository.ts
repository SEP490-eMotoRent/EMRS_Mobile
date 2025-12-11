import { ApiResponse } from "../../../core/network/APIResponse";
import { AnalyzeReturnResponse } from "../../../data/models/rentalReturn/AnalyzeReturnResponse";
import { AiAnalyzeUseCaseInput } from "../../usecases/rentalReturn/AiAnalyzeUseCase";
import { CreateReceiptResponse } from "../../../data/models/rentalReturn/CreateReceiptResponse";
import { RentalReturnCreateReceiptUseCaseInput } from "../../usecases/rentalReturn/CreateReceiptUseCase";
import { SummaryResponse } from "../../../data/models/rentalReturn/SummaryResponse";
import { FinalizeReturnRequest } from "../../../data/models/rentalReturn/FinalizeReturnRequest";
import { FinalizeReturnResponse } from "../../../data/models/rentalReturn/FinalizeReturnResponse";
import { VehicleSwapResponse } from "../../../data/models/rentalReturn/VehicleSwapResponse";
import { SwapVehicleReturnUseCaseInput } from "../../usecases/rentalReturn/SwapVehicleReturnUseCase";
import { UpdateReturnReceiptUseCaseInput } from "../../usecases/rentalReturn/UpdateReturnReceiptUseCase";
import { UpdateReturnReceiptResponse } from "../../../data/models/rentalReturn/UpdateReturnReceiptResponse";

export interface RentalReturnRepository {
    analyzeReturn(input: AiAnalyzeUseCaseInput): Promise<ApiResponse<AnalyzeReturnResponse>>;
    createReceipt(input: RentalReturnCreateReceiptUseCaseInput): Promise<ApiResponse<CreateReceiptResponse>>;
    getSummary(bookingId: string): Promise<ApiResponse<SummaryResponse>>;
    finalizeReturn(request: FinalizeReturnRequest): Promise<ApiResponse<FinalizeReturnResponse>>;
    swapVehicleReturn(request: SwapVehicleReturnUseCaseInput): Promise<ApiResponse<VehicleSwapResponse>>;
    updateReturnReceipt(input: UpdateReturnReceiptUseCaseInput): Promise<ApiResponse<UpdateReturnReceiptResponse>>;
}
