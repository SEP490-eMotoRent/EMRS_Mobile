import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AnalyzeReturnRequest } from "../../../../models/rentalReturn/AnalyzeReturnRequest";
import { AnalyzeReturnResponse } from "../../../../models/rentalReturn/AnalyzeReturnResponse";
import { CreateReceiptRequest } from "../../../../models/rentalReturn/CreateReceiptRequest";
import { CreateReceiptResponse } from "../../../../models/rentalReturn/CreateReceiptResponse";
import { FinalizeReturnRequest } from "../../../../models/rentalReturn/FinalizeReturnRequest";
import { FinalizeReturnResponse } from "../../../../models/rentalReturn/FinalizeReturnResponse";
import { SummaryResponse } from "../../../../models/rentalReturn/SummaryResponse";

export interface RentalReturnRemoteDataSource {
    analyzeReturn(request: AnalyzeReturnRequest): Promise<ApiResponse<AnalyzeReturnResponse>>;
    createReceipt(request: CreateReceiptRequest): Promise<ApiResponse<CreateReceiptResponse>>;
    getSummary(bookingId: string): Promise<ApiResponse<SummaryResponse>>;
    finalizeReturn(request: FinalizeReturnRequest): Promise<ApiResponse<FinalizeReturnResponse>>;
}