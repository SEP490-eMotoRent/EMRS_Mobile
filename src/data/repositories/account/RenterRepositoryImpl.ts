import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { Membership } from "../../../domain/entities/financial/Membership";
import { RenterLocalDataSource } from "../../datasources/interfaces/local/account/RenterLocalDataSource";
import { RenterRemoteDataSource } from "../../datasources/interfaces/remote/account/RenterRemoteDataSource";
import { RegisterRenterResponse } from "../../models/account/renter/RegisterRenterResponse";
import { RenterResponse } from "../../models/account/renter/RenterResponse";
import { UpdateRenterRequest } from "../../models/account/renter/UpdateRenterRequest";
import { RenterRepository } from "../../../domain/repositories/account/RenterRepository";

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

    async getCurrentRenter(): Promise<Renter> {
        try {
            const response = await this.remote.getCurrent();
            return this.mapRenterResponseToEntity(response);
        } catch (error) {
            throw error;
        }
    }

    // NEW METHOD: Return raw response
    async getCurrentRenterRaw(): Promise<RenterResponse> {
        try {
            return await this.remote.getCurrent();
        } catch (error) {
            throw error;
        }
    }

    async update(renter: Renter): Promise<void> {
        try {
            const request: UpdateRenterRequest = {
                email: renter.email,
                phone: renter.phone,
                address: renter.address,
                dateOfBirth: renter.dateOfBirth || '',
                mediaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                fullname: renter.account?.fullname || '',
            };

            const response = await this.remote.update(request);
            
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

    private mapRenterResponseToEntity(response: RenterResponse): Renter {
        // Create Account from response
        const account = new Account(
            response.account.id,
            response.account.username,
            '',
            response.account.role,
            response.account.fullname,
            undefined, undefined, false, undefined, undefined,
            null,
            undefined,
            new Date(), null, null, false
        );

        // Create minimal Membership
        const minimalMembership = new Membership(
            '',
            'Basic',
            0, 0, 0, 'Basic membership',
            [],
            new Date(), null, null, false
        );

        // Parse dateOfBirth from "DD/MM/YYYY" format
        let dateOfBirth = response.dateOfBirth;
        if (response.dateOfBirth && response.dateOfBirth.includes('/')) {
            const [day, month, year] = response.dateOfBirth.split('/');
            dateOfBirth = `${year}-${month}-${day}`;
        }

        // Check verification status from documents
        const hasCitizenDoc = response.documents.some(
            doc => doc.documentType === 'Citizen' && doc.verificationStatus
        );

        // Create Renter - CORRECT ARGUMENT ORDER
        const renter = new Renter(
            response.id,
            response.email,
            response.phone,
            response.address,
            response.account.id,
            '', // membershipId
            hasCitizenDoc,
            '',
            dateOfBirth,
            undefined,
            response.avatarUrl || '',
            undefined, // wallet
            account,   // account: Account
            new Date(), // createdAt
            null,      // updatedAt
            null,      // deletedAt
            false      // isDeleted
        );

        renter.attachMembership(minimalMembership);

        return renter;
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
            undefined, // wallet
            minimalAccount, // account
            new Date(),     // createdAt
            null,
            null,
            false
        );

        renter.attachMembership(minimalMembership);
        return renter;
    }
}