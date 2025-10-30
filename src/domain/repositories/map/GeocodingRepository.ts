import { PlaceDetails } from '../../../data/datasources/interfaces/remote/maps/GeocodingDataSource';

export interface GeocodingRepository {
    searchPlaces(query: string): Promise<PlaceDetails[]>;
    getPlaceDetails(placeId: string): Promise<PlaceDetails>;
    geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }>;
}