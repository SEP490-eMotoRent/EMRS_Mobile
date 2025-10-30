import { GeocodingRepository } from '../../repositories/map/GeocodingRepository';

export class GeocodeAddressUseCase {
    constructor(private repository: GeocodingRepository) {}

    async execute(address: string): Promise<{ latitude: number; longitude: number }> {
        if (!address || address.trim().length === 0) {
            throw new Error('Address cannot be empty');
        }
        return await this.repository.geocodeAddress(address.trim());
    }
}