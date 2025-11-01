import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { Membership } from "../../../domain/entities/financial/Membership";
import { RenterLocalDataSource } from "../../datasources/interfaces/local/account/RenterLocalDataSource";
import { RenterRemoteDataSource } from "../../datasources/interfaces/remote/account/RenterRemoteDataSource";
import { RegisterRenterResponse } from "../../models/account/renter/RegisterRenterResponse";
import { RenterResponse } from "../../models/account/renter/RenterResponse";

import { RenterRepository } from "../../../domain/repositories/account/RenterRepository";
import { ScanFaceRequest } from "../../models/account/renter/ScanFaceRequest";
import { ScanFaceResponse } from "../../models/account/renter/ScanFaceResponse";
import { ApiResponse } from "../../../core/network/APIResponse";
import { UpdateRenterRequest } from "../../models/account/renter/update/UpdateRenterRequest";
import { UpdateRenterResponse } from "../../models/account/renter/update/RenterAccountUpdateResponse";

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

    async getCurrentRenterRaw(): Promise<RenterResponse> {
        try {
            return await this.remote.getCurrent();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update renter profile
     * @param request - Update request with profile data
     * @returns UpdateRenterResponse with updated profile including new avatar URL
     */
    async update(request: UpdateRenterRequest): Promise<UpdateRenterResponse> {
        try {
            // Call remote data source with the request
            const response = await this.remote.update(request);
            
            // Optionally update local cache if needed
            // (You might want to fetch fresh data after update)
            
            return response;
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

    /**
     * Maps backend RenterResponse (from GET) to domain Renter entity
     * Uses lowercase fields because C# JSON serializer converts to camelCase
     */
    private mapRenterResponseToEntity(response: RenterResponse): Renter {
        const account = new Account(
            response.account.id,           // lowercase (JSON serialized from C#)
            response.account.username,     // lowercase
            '',
            response.account.role,         // lowercase
            response.account.fullname,     // lowercase
            undefined, undefined, false, undefined, undefined,
            null,
            undefined,
            new Date(), null, null, false
        );

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

        const hasCitizenDoc = response.documents.some(
            doc => doc.documentType === 'Citizen' && doc.verificationStatus
        );

        const renter = new Renter(
            response.id,              // lowercase
            response.email,           // lowercase
            response.phone,           // lowercase
            response.address,         // lowercase
            response.account.id,      // lowercase
            '',
            hasCitizenDoc,
            '',
            dateOfBirth,
            undefined,
            response.avatarUrl || '', // lowercase (camelCase)
            undefined,
            account,
            new Date(),
            null,
            null,
            false
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
            undefined,
            minimalAccount,
            new Date(),
            null,
            null,
            false
        );

        renter.attachMembership(minimalMembership);
        return renter;
    }
}