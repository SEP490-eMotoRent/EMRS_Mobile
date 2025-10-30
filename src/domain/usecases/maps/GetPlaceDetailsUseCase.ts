import { PlaceDetails } from '../../../data/datasources/interfaces/remote/maps/GeocodingDataSource';
import { GeocodingRepository } from '../../repositories/map/GeocodingRepository';

export class GetPlaceDetailsUseCase {
    constructor(private repository: GeocodingRepository) {}

    async execute(placeId: string): Promise<PlaceDetails> {
        return await this.repository.getPlaceDetails(placeId);
    }
}
