import { Branch } from "../../../domain/entities/operations/Branch";
import { BranchRepository } from "../../../domain/repositories/operations/BranchRepository";
import { BranchLocalDataSource } from "../../datasources/interfaces/local/branch/BranchLocalDataSource";
import { BranchResponse } from "../../models/branch/BranchResponse";
import { CreateBranchRequest } from "../../models/branch/CreateBranchRequest";

export class BranchRepositoryImpl implements BranchRepository {
    constructor(private local: BranchLocalDataSource) {}

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
        await this.local.create(request);
    }

    async delete(branch: Branch): Promise<void> {
        await this.local.delete(branch.id);
    }

    async getAll(): Promise<Branch[]> {
        const models = await this.local.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    async getById(id: string): Promise<Branch | null> {
        const model = await this.local.getById(id);
        return model ? this.mapToEntity(model) : null;
    }

    async update(branch: Branch): Promise<void> {
        const model: BranchResponse = {
        id: branch.id,
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
        await this.local.update(branch.id, model);
    }

    private mapToEntity(model: BranchResponse): Branch {
        return new Branch(
        model.id, model.branchName, model.address, model.city, model.phone,
        model.email, model.latitude, model.longitude, model.openingTime, model.closingTime,
        [], [], [], [], [], [], [], new Date(), null, null, false
        );
    }
}