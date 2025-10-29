import { ApiResponse } from "../../../../../core/network/APIResponse";
import { CreateHandoverReceiptRequest } from "../../../../models/receipt/CreateHandoverReceiptRequest";
import { GetContractResponse } from "../../../../models/receipt/GetContractResponse";
import { HandoverReceiptResponse } from "../../../../models/receipt/HandoverReceiptResponse";


export interface ReceiptRemoteDataSource {
    createHandoverReceipt(request: CreateHandoverReceiptRequest): Promise<ApiResponse<HandoverReceiptResponse>>;
    generateContract(bookingId: string): Promise<ApiResponse<string>>;
    getContract(bookingId: string): Promise<ApiResponse<GetContractResponse>>;
}

