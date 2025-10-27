import { ApiResponse } from "../../../../../core/network/APIResponse";
import { CreateHandoverReceiptRequest } from "../../../../models/receipt/CreateHandoverReceiptRequest";
import { HandoverReceiptResponse } from "../../../../models/receipt/HandoverReceiptResponse";


export interface ReceiptRemoteDataSource {
    createHandoverReceipt(request: CreateHandoverReceiptRequest): Promise<ApiResponse<HandoverReceiptResponse>>;
}

