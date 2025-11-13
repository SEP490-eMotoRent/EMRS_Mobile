import { Branch } from "../../../domain/entities/operations/Branch";
import { BranchRepository } from "../../../domain/repositories/operations/BranchRepository";
import { BranchRemoteDataSource } from "../../datasources/interfaces/remote/branch/BranchRemoteDataSource";
import { BranchResponse } from "../../models/branch/BranchResponse";
import { BranchModelDetailResponse } from "../../models/branch/BranchModelDetailResponse";
import { CreateBranchRequest } from "../../models/branch/CreateBranchRequest";
import { SearchChargingStationsRequest } from "../../models/branch/SearchChargingStationsRequest";
import { UpdateBranchRequest } from "../../models/branch/UpdateBranchRequest";

/**
 * ✅ Extended Branch type for getByVehicleModelId (includes vehicleCount from DTO)
 */
export interface BranchWithVehicleCount extends Branch {
  vehicleCount?: number;
}

export class BranchRepositoryImpl implements BranchRepository {
  constructor(private remoteDataSource: BranchRemoteDataSource) {}

  async create(branch: Branch): Promise<void> {
    const request: CreateBranchRequest = {
      branchName: branch.branchName,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      email: branch.email,
      latitude: branch.latitude,
      longitude: branch.longitude,
      openingTime: branch.openingTime,
      closingTime: branch.closingTime,
    };
    await this.remoteDataSource.create(request);
  }

  async delete(branch: Branch): Promise<void> {
    await this.remoteDataSource.delete(branch.id);
  }

  async getAll(): Promise<Branch[]> {
    const responses = await this.remoteDataSource.getAll();
    return responses.map((response) => this.mapToEntity(response));
  }

  async getById(id: string): Promise<Branch | null> {
    try {
      const response = await this.remoteDataSource.getById(id);
      return this.mapToEntity(response);
    } catch (error) {
      return null;
    }
  }

  /**
   * ✅ UPDATED: Returns BranchWithVehicleCount (includes vehicleCount from DTO)
   */
  async getByVehicleModelId(vehicleModelId: string): Promise<BranchWithVehicleCount[]> {
    const responses = await this.remoteDataSource.getByVehicleModelId(
      vehicleModelId
    );
    // ✅ Use special mapper for BranchModelDetailResponse
    return responses.map((response) => this.mapDetailResponseToEntityWithCount(response));
  }

  async update(branch: Branch): Promise<void> {
    const request: UpdateBranchRequest = {
      branchName: branch.branchName,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      email: branch.email,
      latitude: branch.latitude,
      longitude: branch.longitude,
      openingTime: branch.openingTime,
      closingTime: branch.closingTime,
    };
    await this.remoteDataSource.update(branch.id, request);
  }

  /**
   * Search for nearby charging stations
   */
  async searchChargingStations(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Branch[]> {
    const request: SearchChargingStationsRequest = {
      latitude,
      longitude,
      radius
    };
    
    const responses = await this.remoteDataSource.searchChargingStations(request);
    return responses.map(response => this.mapToEntity(response));
  }

  async getByLocation(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Branch[]> {
    const response = await this.remoteDataSource.getByLocation(
      latitude,
      longitude,
      radius
    );
    return response.data.map((response: BranchResponse) =>
      this.mapToEntity(response)
    );
  }

  /**
   * ✅ Standard mapper: BranchResponse → Branch (no vehicleCount)
   */
  private mapToEntity(response: BranchResponse): Branch {
    return new Branch(
      response.id,
      response.branchName,
      response.address,
      response.city,
      response.phone,
      response.email,
      response.latitude,
      response.longitude,
      response.openingTime,
      response.closingTime,
      [], // staffs - empty for now
      [], // vehicles - empty for now
      [], // chargingRecords
      [], // sentTransferOrders
      [], // receivedTransferOrders
      [], // handoverBookings
      [], // returnBookings
      new Date(), // createdAt
      null, // updatedAt
      null, // deletedAt
      false // isDeleted
    );
  }

  /**
   * ✅ NEW: Special mapper for BranchModelDetailResponse → Branch WITH vehicleCount
   * Used only by getByVehicleModelId
   */
  private mapDetailResponseToEntityWithCount(
    response: BranchModelDetailResponse
  ): BranchWithVehicleCount {
    const branch = new Branch(
      response.id,
      response.branchName,
      response.address,
      response.city,
      response.phone,
      response.email,
      response.latitude,
      response.longitude,
      response.openingTime,
      response.closingTime,
      [], // staffs
      [], // vehicles
      [], // chargingRecords
      [], // sentTransferOrders
      [], // receivedTransferOrders
      [], // handoverBookings
      [], // returnBookings
      new Date(), // createdAt
      null, // updatedAt
      null, // deletedAt
      false // isDeleted
    );
    (branch as any).vehicleCount = response.vehicleCount;
    return branch as BranchWithVehicleCount;
  }
}