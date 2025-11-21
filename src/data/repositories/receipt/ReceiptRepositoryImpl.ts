import { ApiResponse } from "../../../core/network/APIResponse";
import { RentalContract } from "../../../domain/entities/booking/RentalContract";
import {
  RentalReceipt,
  UpdateRentalReceiptInput,
} from "../../../domain/entities/booking/RentalReceipt";
import { ReceiptRepository } from "../../../domain/repositories/receipt/ReceiptRepository";
import { CreateReceiptUseCaseInput } from "../../../domain/usecases/receipt/CreateReceiptUseCase";
import { ReceiptRemoteDataSource } from "../../datasources/interfaces/remote/receipt/ReceiptRemoteDataSource";
import { CreateReceiptRequest } from "../../models/receipt/CreateReceiptRequest";
import { GetContractResponse } from "../../models/receipt/GetContractResponse";
import { HandoverReceiptResponse } from "../../models/receipt/HandoverReceiptResponse";
import { UpdateReceiptUseCaseInput } from "../../../domain/usecases/receipt/UpdateReceiptUseCase";
import { UpdateReceiptRequest } from "../../models/receipt/UpdateReceiptRequest";
import { ChangeVehicleUseCaseInput } from "../../../domain/usecases/receipt/ChangeVehicleUseCase";
import { ChangeVehicleRequest } from "../../models/receipt/ChangeVehicleRequest";
import { ChangeVehicleResponse } from "../../models/receipt/ChangeVehicleResponse";

export class ReceiptRepositoryImpl implements ReceiptRepository {
  constructor(private remote: ReceiptRemoteDataSource) {}

  async changeVehicle(
    input: ChangeVehicleUseCaseInput
  ): Promise<ApiResponse<ChangeVehicleResponse>> {
    const request: ChangeVehicleRequest = {
      notes: input.notes,
      startOdometerKm: input.startOdometerKm,
      startBatteryPercentage: input.startBatteryPercentage,
      bookingId: input.bookingId,
      vehicleFiles: input.vehicleFiles.map(
        (uri, index) =>
          ({
            uri,
            type: "image/jpeg",
            name: `vehicle_${Date.now()}_${index}.jpg`,
          } as any)
      ),
      checkListFile: {
        uri: input.checkListFile,
        type: "image/png",
        name: `checklist_${Date.now()}.png`,
      } as any,
      vehicleId: input.vehicleId,
    };
    return await this.remote.changeVehicle(request);
  }

  async createHandoverReceipt(
    input: CreateReceiptUseCaseInput
  ): Promise<ApiResponse<HandoverReceiptResponse>> {
    const request: CreateReceiptRequest = {
      notes: input.notes,
      startOdometerKm: input.startOdometerKm,
      startBatteryPercentage: input.startBatteryPercentage,
      bookingId: input.bookingId,
      vehicleFiles: input.vehicleFiles.map(
        (uri, index) =>
          ({
            uri,
            type: "image/jpeg",
            name: `vehicle_${Date.now()}_${index}.jpg`,
          } as any)
      ),
      checkListFile: {
        uri: input.checkListFile,
        type: "image/png",
        name: `checklist_${Date.now()}.png`,
      } as any,
    };

    return await this.remote.createHandoverReceipt(request);
  }

  async updateRentalReceipt(input: UpdateReceiptUseCaseInput): Promise<void> {
    const request: UpdateReceiptRequest = {
      rentalReceiptId: input.rentalReceiptId,
      endOdometerKm: input.endOdometerKm,
      endBatteryPercentage: input.endBatteryPercentage,
      returnVehicleImagesFiles: input.vehicleFiles.map(
        (uri, index) =>
          ({
            uri,
            type: "image/jpeg",
            name: `vehicle_${Date.now()}_${index}.jpg`,
          } as any)
      ),
      returnCheckListFile: {
        uri: input.checkListFile,
        type: "image/png",
        name: `checklist_${Date.now()}.png`,
      } as any,
    };
    return await this.remote.updateRentalReceipt(request);
  }

  async generateContract(
    bookingId: string,
    receiptId: string
  ): Promise<ApiResponse<string>> {
    return await this.remote.generateContract(bookingId, receiptId);
  }

    async getListRentalReceipt(bookingId: string): Promise<ApiResponse<RentalReceipt[]>> {
        return await this.remote.getListRentalReceipt(bookingId);
    }

    async getDetailRentalReceipt(rentalReceiptId: string): Promise<ApiResponse<RentalReceipt>> {
        return await this.remote.getDetailRentalReceipt(rentalReceiptId);
    }

  async getContract(bookingId: string): Promise<RentalContract | null> {
    const response = await this.remote.getContract(bookingId);
    return this.mapToEntity(response.data);
  }

  async generateOtp(contractId: string): Promise<ApiResponse<string>> {
    return await this.remote.generateOtp(contractId);
  }

  async signContract(
    contractId: string,
    receiptId: string,
    otpCode: string
  ): Promise<ApiResponse<string>> {
    return await this.remote.signContract(contractId, receiptId, otpCode);
  }

  private mapToEntity(dto: GetContractResponse): RentalContract {
    return new RentalContract(
      dto.id,
      dto.contractNumber || "",
      dto.contractTerms || "",
      dto.otpCode,
      dto.contractStatus,
      dto.file,
      undefined,
      undefined,
      undefined,
      new Date(),
      null,
      null,
      false
    );
  }
}
