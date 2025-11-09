import { Branch } from "../../../domain/entities/operations/Branch";
import { BranchRepository } from "../../../domain/repositories/operations/BranchRepository";
import { BranchRemoteDataSource } from "../../datasources/interfaces/remote/branch/BranchRemoteDataSource";
import { BranchResponse } from "../../models/branch/BranchResponse";
import { CreateBranchRequest } from "../../models/branch/CreateBranchRequest";
import { UpdateBranchRequest } from "../../models/branch/UpdateBranchRequest";

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
            closingTime: branch.closingTime
        };
        await this.remoteDataSource.create(request);
    }

    async delete(branch: Branch): Promise<void> {
        await this.remoteDataSource.delete(branch.id);
    }

    async getAll(): Promise<Branch[]> {
        const responses = await this.remoteDataSource.getAll();
        return responses.map(response => this.mapToEntity(response));
    }

    async getById(id: string): Promise<Branch | null> {
        try {
            const response = await this.remoteDataSource.getById(id);
            return this.mapToEntity(response);
        } catch (error) {
            return null;
        }
    }

    async getByVehicleModelId(vehicleModelId: string): Promise<Branch[]> {
        const responses = await this.remoteDataSource.getByVehicleModelId(vehicleModelId);
        return responses.map(response => this.mapToEntity(response));
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
            closingTime: branch.closingTime
        };
        await this.remoteDataSource.update(branch.id, request);
    }

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
}