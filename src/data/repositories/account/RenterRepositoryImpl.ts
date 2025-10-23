import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { Membership } from "../../../domain/entities/financial/Membership";
import { RenterLocalDataSource } from "../../datasources/interfaces/local/account/RenterLocalDataSource";
import { RegisterRenterResponse } from "../../models/account/renter/RegisterRenterResponse";
import { RenterRepository } from "../../../domain/repositories/account/RenterRepository";


export class RenterRepositoryImpl implements RenterRepository {
    constructor(private local: RenterLocalDataSource) {}

    // ✅ FIXED: EXACT METHOD NAMES
    async create(renter: Renter): Promise<void> {
        // Save renter data to AsyncStorage
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

    // ✅ FIXED: EXACT METHOD NAMES
    async getAll(): Promise<Renter[]> {
        const models = await this.local.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    private mapToEntity(model: RegisterRenterResponse): Renter {
        // Create minimal Account and Membership first
        const accountId = model.accountId;
        const minimalAccount = new Account(
        accountId,
        `user_${accountId}`,
        'password123',
        'Renter',
        `User ${accountId}`,
        undefined, undefined, false, undefined, undefined,
        null, // renter (will link later)
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

        // Create Renter
        const renter = new Renter(
        model.id,
        model.email,
        model.phone,
        model.address,
        model.avatarUrl,
        model.accountId,
        model.membershipId,
        minimalAccount,           
        minimalMembership,        
        false,                    
        '',                       
        model.dateOfBirth,
        model.verificationCodeExpiry ? new Date(model.verificationCodeExpiry) : undefined,
        undefined,                
        new Date(),               
        null,                     
        null,                     
        false                     
        );

        // Link circular reference
        minimalAccount.renter = renter;

        return renter;
    }
}