import { ApiResponse } from "../../../core/network/APIResponse";
import { HandoverReceiptResponse } from "../../../data/models/receipt/HandoverReceiptResponse";
import { RentalContract } from "../../entities/booking/RentalContract";
import { RentalReceipt } from "../../entities/booking/RentalReceipt";
import { ChangeVehicleUseCaseInput } from "../../usecases/receipt/ChangeVehicleUseCase";
import { CreateReceiptUseCaseInput } from "../../usecases/receipt/CreateReceiptUseCase";
import { ChangeVehicleResponse } from "../../../data/models/receipt/ChangeVehicleResponse";
import { UpdateHandoverReceiptUseCaseInput } from "../../usecases/receipt/UpdateHandoverReceiptUseCase";

export interface ReceiptRepository {
  changeVehicle(input: ChangeVehicleUseCaseInput): Promise<ApiResponse<ChangeVehicleResponse>>;
  createHandoverReceipt(
    input: CreateReceiptUseCaseInput
  ): Promise<ApiResponse<HandoverReceiptResponse>>;
  getListRentalReceipt(bookingId: string): Promise<ApiResponse<RentalReceipt[]>>;
  getDetailRentalReceipt(rentalReceiptId: string): Promise<ApiResponse<RentalReceipt>>;
  updateHandoverReceipt(input: UpdateHandoverReceiptUseCaseInput): Promise<ApiResponse<void>>;
  generateContract(
    bookingId: string,
    receiptId: string
  ): Promise<ApiResponse<string>>;
  getContract(bookingId: string): Promise<RentalContract | null>;
  generateOtp(contractId: string): Promise<ApiResponse<string>>;
  signContract(
    contractId: string,
    receiptId: string,
    otpCode: string
  ): Promise<ApiResponse<string>>;
}
