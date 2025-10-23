import { CreateMembershipRequest } from "../../../../models/financial/CreateMembershipRequest";

export interface MembershipRemoteDataSource {
    create(request: CreateMembershipRequest): Promise<CreateMembershipRequest>;
    getAll(): Promise<CreateMembershipRequest[]>;
    getById(id: string): Promise<CreateMembershipRequest | null>;
}