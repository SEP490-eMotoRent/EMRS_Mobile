import { Membership } from "../../../domain/entities/financial/Membership";
import { MembershipRepository } from "../../../domain/repositories/financial/MembershipRepository";
import { MembershipLocalDataSource } from "../../datasources/interfaces/local/financial/MembershipLocalDataSource";
import { CreateMembershipRequest } from "../../models/financial/CreateMembershipRequest";

export class MembershipRepositoryImpl implements MembershipRepository {
    constructor(private local: MembershipLocalDataSource) {}

    async create(membership: Membership): Promise<void> {
        const request: CreateMembershipRequest = {
        tierName: membership.tierName,
        minBookings: membership.minBookings,
        discountPercentage: membership.discountPercentage,
        freeChargingPerMonth: membership.freeChargingPerMonth,
        description: membership.description
        };
        await this.local.create(request);
    }

    async getAll(): Promise<Membership[]> {
        const models = await this.local.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    // async getById(id: string): Promise<Membership | null> {
    //     const model = await this.local.getById(id);
    //     return model ? this.mapToEntity(model) : null;
    // }

    private mapToEntity(model: CreateMembershipRequest): Membership {
        return new Membership(
        `local_${Date.now()}`,  // id
        model.tierName,
        model.minBookings,
        model.discountPercentage,
        model.freeChargingPerMonth,
        model.description,
        [],                     // renters
        new Date(),             // createdAt
        null,                   // updatedAt
        null,                   // deletedAt
        false                   // isDeleted
        );
    }
}