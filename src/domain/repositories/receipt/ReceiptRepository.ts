import { ApiResponse } from "../../../core/network/APIResponse";
import { HandoverReceiptResponse } from "../../../data/models/receipt/HandoverReceiptResponse";
import { CreateHandoverReceiptUseCaseInput } from "../../usecases/receipt/CreateHandoverReceiptUseCase";

export interface ReceiptRepository {
  createHandoverReceipt(
    input: CreateHandoverReceiptUseCaseInput
  ): Promise<ApiResponse<HandoverReceiptResponse>>;
}
