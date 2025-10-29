import { ApiResponse } from "../../../core/network/APIResponse";
import { GetContractResponse } from "../../../data/models/receipt/GetContractResponse";
import { HandoverReceiptResponse } from "../../../data/models/receipt/HandoverReceiptResponse";
import { RentalContract } from "../../entities/booking/RentalContract";
import { CreateHandoverReceiptUseCaseInput } from "../../usecases/receipt/CreateHandoverReceiptUseCase";

export interface ReceiptRepository {
  createHandoverReceipt(
    input: CreateHandoverReceiptUseCaseInput
  ): Promise<ApiResponse<HandoverReceiptResponse>>;
  generateContract(bookingId: string): Promise<ApiResponse<string>>;
  getContract(bookingId: string): Promise<RentalContract | null>;
}
