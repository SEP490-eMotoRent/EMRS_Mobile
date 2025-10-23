import { CreateMembershipRequest } from "../../../../models/financial/CreateMembershipRequest";

export interface MembershipLocalDataSource {
    create(request: CreateMembershipRequest): Promise<CreateMembershipRequest>;
    getAll(): Promise<CreateMembershipRequest[]>;
    // getById(id: string): Promise<CreateMembershipRequest | null>;
}