import { RenterRepository } from '../../../repositories/account/RenterRepository';
import { Renter } from '../../../entities/account/Renter';
import { RenterResponse } from '../../../../data/models/account/renter/RenterResponse';

// Return type that includes both entity and raw response
export interface CurrentRenterResult {
    renter: Renter;
    rawResponse: RenterResponse;
}

export class GetCurrentRenterUseCase {
    constructor(private renterRepository: RenterRepository) {}

    async execute(): Promise<CurrentRenterResult> {
        try {
            const renter = await this.renterRepository.getCurrentRenter();
            if (!renter) {
                throw new Error('No renter profile found');
            }

            // Get the raw response from the repository
            const rawResponse = await this.renterRepository.getCurrentRenterRaw();
            
            return {
                renter,
                rawResponse
            };
        } catch (error) {
            throw error;
        }
    }
}