import { Renter } from '../../domain/entities/account/Renter';
import { RenterRepository } from '../../domain/repositories/RenterRepository';
import { RenterLocalDataSource } from '../datasources/local/RenterLocalDataSource';
import { RenterRemoteDataSource } from '../datasources/remote/RenterRemoteDataSource';
import { RenterModel } from '../models/RenterModel';

export class RenterRepositoryImpl implements RenterRepository {
    private readonly remote: RenterRemoteDataSource;
    private readonly local: RenterLocalDataSource;

    constructor({
        remote,
        local,
    }: {
        remote: RenterRemoteDataSource;
        local: RenterLocalDataSource;
    }) {
        this.remote = remote;
        this.local = local;
    }

    async getRenter(id: string): Promise<Renter | null> {
        const cached = await this.local.getCachedRenter(id);
        if (cached) return cached.toEntity();

        const remoteModel = await this.remote.getRenter(id);
        if (remoteModel) {
        await this.local.cacheRenter(remoteModel);
        return remoteModel.toEntity();
        }
        return null;
    }

    async createRenter(renter: Renter): Promise<void> {
        const model = RenterModel.fromEntity(renter);
        await this.remote.createRenter(model);
        await this.local.cacheRenter(model);
    }

    async updateRenter(renter: Renter): Promise<void> {
        const model = RenterModel.fromEntity(renter);
        await this.remote.updateRenter(model);
        await this.local.cacheRenter(model);
    }
}