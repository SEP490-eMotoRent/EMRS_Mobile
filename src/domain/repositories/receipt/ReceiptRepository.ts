import { ApiResponse } from "../../../core/network/APIResponse";
import { HandoverReceiptResponse } from "../../../data/models/receipt/HandoverReceiptResponse";
import { RentalContract } from "../../entities/booking/RentalContract";
import { RentalReceipt } from "../../entities/booking/RentalReceipt";
import { CreateReceiptUseCaseInput } from "../../usecases/receipt/CreateReceiptUseCase";
import { UpdateReceiptUseCaseInput } from "../../usecases/receipt/UpdateReceiptUseCase";

export interface ReceiptRepository {
  createHandoverReceipt(
    input: CreateReceiptUseCaseInput
  ): Promise<ApiResponse<HandoverReceiptResponse>>;
  getListRentalReceipt(bookingId: string): Promise<ApiResponse<RentalReceipt[]>>;
  getDetailRentalReceipt(rentalReceiptId: string): Promise<ApiResponse<RentalReceipt>>;
  updateRentalReceipt(input: UpdateReceiptUseCaseInput): Promise<void>;
  generateContract(bookingId: string, receiptId: string): Promise<ApiResponse<string>>;
  getContract(bookingId: string): Promise<RentalContract | null>;
  generateOtp(contractId: string): Promise<ApiResponse<string>>;
  signContract(contractId: string, receiptId: string, otpCode: string): Promise<ApiResponse<string>>;
}
  