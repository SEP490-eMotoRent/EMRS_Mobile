import { CreateHandoverReceiptRequest } from "../../models/receipt/CreateHandoverReceiptRequest";
import { ApiResponse } from "../../../../core/network/APIResponse";

export interface ReceiptRemoteDataSource {
    createHandoverReceipt(request: CreateHandoverReceiptRequest): Promise<ApiResponse<void>>;
}

