import { ApiResponse } from "../../../../../core/network/APIResponse";
import { CreateReceiptRequest } from "../../../../models/receipt/CreateReceiptRequest";
import { GetContractResponse } from "../../../../models/receipt/GetContractResponse";
import { HandoverReceiptResponse } from "../../../../models/receipt/HandoverReceiptResponse";
import { UpdateReceiptRequest } from "../../../../models/receipt/UpdateReceiptRequest";


export interface ReceiptRemoteDataSource {
    createHandoverReceipt(request: CreateReceiptRequest): Promise<ApiResponse<HandoverReceiptResponse>>;
    updateRentalReceipt(request: UpdateReceiptRequest): Promise<void>;
    generateContract(bookingId: string): Promise<ApiResponse<string>>;
    getContract(bookingId: string): Promise<ApiResponse<GetContractResponse>>;
    generateOtp(contractId: string): Promise<ApiResponse<string>>;
    signContract(contractId: string, otpCode: string): Promise<ApiResponse<string>>;
}

