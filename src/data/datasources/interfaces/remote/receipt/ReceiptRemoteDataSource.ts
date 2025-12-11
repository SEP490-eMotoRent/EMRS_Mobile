import { ApiResponse } from "../../../../../core/network/APIResponse";
import { RentalReceipt } from "../../../../../domain/entities/booking/RentalReceipt";
import { ChangeVehicleRequest } from "../../../../models/receipt/ChangeVehicleRequest";
import { CreateReceiptRequest } from "../../../../models/receipt/CreateReceiptRequest";
import { GetContractResponse } from "../../../../models/receipt/GetContractResponse";
import { HandoverReceiptResponse } from "../../../../models/receipt/HandoverReceiptResponse";
import { UpdateReceiptRequest } from "../../../../models/receipt/UpdateReceiptRequest";
import { ChangeVehicleResponse } from "../../../../models/receipt/ChangeVehicleResponse";


export interface ReceiptRemoteDataSource {
    changeVehicle(request: ChangeVehicleRequest): Promise<ApiResponse<ChangeVehicleResponse>>;
    createHandoverReceipt(request: CreateReceiptRequest): Promise<ApiResponse<HandoverReceiptResponse>>;
    getListRentalReceipt(bookingId: string): Promise<ApiResponse<RentalReceipt[]>>;
    getDetailRentalReceipt(rentalReceiptId: string): Promise<ApiResponse<RentalReceipt>>;
    updateHandoverReceipt(request: UpdateReceiptRequest): Promise<ApiResponse<void>>;
    generateContract(bookingId: string, receiptId: string): Promise<ApiResponse<string>>;
    getContract(bookingId: string): Promise<ApiResponse<GetContractResponse>>;
    generateOtp(contractId: string): Promise<ApiResponse<string>>;
    signContract(contractId: string, receiptId: string, otpCode: string): Promise<ApiResponse<string>>;
}

