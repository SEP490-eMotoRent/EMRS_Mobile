import { PlaceDetails } from '../../../data/datasources/interfaces/remote/maps/GeocodingDataSource';
import { GeocodingRepository } from '../../repositories/map/GeocodingRepository';

export class SearchPlacesUseCase {
    constructor(private repository: GeocodingRepository) {}

    async execute(query: string): Promise<PlaceDetails[]> {
        if (!query || query.trim().length < 3) {
            return [];
        }
        return await this.repository.searchPlaces(query.trim());
    }
}