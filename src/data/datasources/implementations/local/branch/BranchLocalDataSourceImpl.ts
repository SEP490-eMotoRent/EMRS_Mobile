import AsyncStorage from '@react-native-async-storage/async-storage';
import { BranchResponse } from '../../../../models/branch/BranchResponse';
import { CreateBranchRequest } from '../../../../models/branch/CreateBranchRequest';
import { BranchLocalDataSource } from '../../../interfaces/local/branch/BranchLocalDataSource';


export class BranchLocalDataSourceImpl implements BranchLocalDataSource {
    private readonly KEY = '@branches';

    async create(request: CreateBranchRequest): Promise<BranchResponse> {
        const branches = await this.getAll();
        const newBranch: BranchResponse = { id: `local_${Date.now()}`, ...request };
        branches.push(newBranch);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(branches));
        return newBranch;
    }

    async getAll(): Promise<BranchResponse[]> {
        try {
        const data = await AsyncStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
        } catch {
        return [];
        }
    }

    async getById(id: string): Promise<BranchResponse | null> {
        const branches = await this.getAll();
        return branches.find(b => b.id === id) || null;
    }

    // ✅ NEW: update
    async update(id: string, branch: BranchResponse): Promise<void> {
        const branches = await this.getAll();
        const index = branches.findIndex(b => b.id === id);
        if (index !== -1) {
        branches[index] = branch;
        await AsyncStorage.setItem(this.KEY, JSON.stringify(branches));
        }
    }

    // ✅ NEW: delete  
    async delete(id: string): Promise<void> {
        const branches = await this.getAll();
        const filtered = branches.filter(b => b.id !== id);
        await AsyncStorage.setItem(this.KEY, JSON.stringify(filtered));
    }
}