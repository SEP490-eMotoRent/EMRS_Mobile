import { ApiResponse } from "../../../core/network/APIResponse";
import { HandoverReceiptResponse } from "../../../data/models/receipt/HandoverReceiptResponse";
import { RentalContract } from "../../entities/booking/RentalContract";
import { CreateReceiptUseCaseInput } from "../../usecases/receipt/CreateReceiptUseCase";
import { UpdateReceiptUseCaseInput } from "../../usecases/receipt/UpdateReceiptUseCase";

export interface ReceiptRepository {
  createHandoverReceipt(
    input: CreateReceiptUseCaseInput
  ): Promise<ApiResponse<HandoverReceiptResponse>>;
  updateRentalReceipt(input: UpdateReceiptUseCaseInput): Promise<void>;
  generateContract(bookingId: string): Promise<ApiResponse<string>>;
  getContract(bookingId: string): Promise<RentalContract | null>;
  generateOtp(contractId: string): Promise<ApiResponse<string>>;
  signContract(contractId: string, otpCode: string): Promise<ApiResponse<string>>;
}
