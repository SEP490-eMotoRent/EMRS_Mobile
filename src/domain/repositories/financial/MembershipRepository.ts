import { Membership } from '../../entities/financial/Membership';

export interface MembershipRepository {
    create(membership: Membership): Promise<void>;
    getAll(): Promise<Membership[]>;
    // getById(id: string): Promise<Membership | null>;
}