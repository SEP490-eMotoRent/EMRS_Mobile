import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { Membership } from "../../../domain/entities/financial/Membership";
import { RenterLocalDataSource } from "../../datasources/interfaces/local/account/RenterLocalDataSource";
import { RenterRemoteDataSource } from "../../datasources/interfaces/remote/account/RenterRemoteDataSource";
import { RegisterRenterResponse } from "../../models/account/renter/RegisterRenterResponse";
import { UpdateRenterRequest } from "../../models/account/renter/UpdateRenterRequest";
import { RenterRepository } from "../../../domain/repositories/account/RenterRepository";
import { ScanFaceRequest } from "../../models/account/renter/ScanFaceRequest";
import { ScanFaceResponse } from "../../models/account/renter/ScanFaceResponse";
import { ApiResponse } from "../../../core/network/APIResponse";

export class RenterRepositoryImpl implements RenterRepository {
    constructor(
        private local: RenterLocalDataSource,
        private remote: RenterRemoteDataSource
    ) {}

    async create(renter: Renter): Promise<void> {
        const model: RegisterRenterResponse = {
            id: renter.id,
            email: renter.email,
            phone: renter.phone,
            address: renter.address,
            dateOfBirth: renter.dateOfBirth,
            avatarUrl: renter.avatarUrl,
            accountId: renter.accountId,
            membershipId: renter.membershipId,
            verificationCodeExpiry: renter.verificationCodeExpiry?.toISOString()
        };
        const renters = await this.local.getAll();
        renters.push(model);
        await AsyncStorage.setItem('@renters', JSON.stringify(renters));
    }

    async getAll(): Promise<Renter[]> {
        const models = await this.local.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    async update(renter: Renter): Promise<void> {
        try {
            const request: UpdateRenterRequest = {
                email: renter.email,
                phone: renter.phone,
                address: renter.address,
                dateOfBirth: renter.dateOfBirth || '',
                mediaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // TODO: Get actual mediaId
                fullname: renter.account?.fullname || '',
            };

            const response = await this.remote.update(request);
            
            // Update local storage
            const renters = await this.local.getAll();
            const index = renters.findIndex(r => r.id === renter.id);
            if (index !== -1) {
                renters[index] = response;
                await AsyncStorage.setItem('@renters', JSON.stringify(renters));
            }
        } catch (error) {
            throw error;
        }
    }

    async scanFace(request: ScanFaceRequest): Promise<ApiResponse<ScanFaceResponse>> {
        try {
          return await this.remote.scanFace(request);
        } catch (error) {
          throw error;
        }
    }

    private mapToEntity(model: RegisterRenterResponse): Renter {
        const accountId = model.accountId;
        const minimalAccount = new Account(
            accountId,
            `user_${accountId}`,
            'password123',
            'Renter',
            `User ${accountId}`,
            undefined, undefined, false, undefined, undefined,
            null,
            undefined,
            new Date(), null, null, false
        );

        const membershipId = model.membershipId;
        const minimalMembership = new Membership(
            membershipId,
            'Basic',
            0, 0, 0, 'Basic membership',
            [],
            new Date(), null, null, false
        );

        const renter = new Renter(
            model.id,
            model.email,
            model.phone,
            model.address,
            model.accountId,
            model.membershipId,
            false,
            '',
            model.dateOfBirth,
            model.verificationCodeExpiry ? new Date(model.verificationCodeExpiry) : undefined,
            model.avatarUrl,
            undefined,
            undefined,
            new Date(),
            null,
            null,
            false
        );

        renter.attachAccount(minimalAccount);
        renter.attachMembership(minimalMembership);
        minimalAccount.renter = renter;

        return renter;
    }
}