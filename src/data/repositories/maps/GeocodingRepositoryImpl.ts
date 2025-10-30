import { GeocodingRepository } from '../../../domain/repositories/map/GeocodingRepository';
import { GeocodingDataSource, PlaceDetails } from '../../datasources/interfaces/remote/maps/GeocodingDataSource';

export class GeocodingRepositoryImpl implements GeocodingRepository {
    constructor(private dataSource: GeocodingDataSource) {}

    async searchPlaces(query: string): Promise<PlaceDetails[]> {
        return await this.dataSource.searchPlaces(query);
    }

    async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
        return await this.dataSource.getPlaceDetails(placeId);
    }

    async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
        return await this.dataSource.geocodeAddress(address);
    }
}
