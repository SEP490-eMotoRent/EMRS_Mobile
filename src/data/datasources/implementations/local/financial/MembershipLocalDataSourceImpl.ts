import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateMembershipRequest } from '../../../../models/financial/CreateMembershipRequest';
import { MembershipLocalDataSource } from '../../../interfaces/local/financial/MembershipLocalDataSource';

export class MembershipLocalDataSourceImpl implements MembershipLocalDataSource {
    private readonly KEY = '@memberships';

    async create(request: CreateMembershipRequest): Promise<CreateMembershipRequest> {
        const memberships = await this.getAll();
        const newMembership = { ...request, id: `local_${Date.now()}` };
        memberships.push(newMembership);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(memberships));
        return newMembership;
    }

    async getAll(): Promise<CreateMembershipRequest[]> {
        try {
        const data = await AsyncStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
        } catch {
        return [];
        }
    }

    // async getById(id: string): Promise<CreateMembershipRequest | null> {
    //     const memberships = await this.getAll();
    //     return memberships.find(m => m.id === id) || null;
    // }
}