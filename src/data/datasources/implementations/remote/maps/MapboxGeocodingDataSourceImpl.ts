import { GeocodingDataSource, PlaceDetails } from '../../../interfaces/remote/maps/GeocodingDataSource';
import { MapboxConfig } from '../../../../../core/config/MapboxConfig';

export class MapboxGeocodingDataSourceImpl implements GeocodingDataSource {
    private readonly baseUrl = 'https://api.mapbox.com';
    
    async searchPlaces(query: string): Promise<PlaceDetails[]> {
        try {
            // Mapbox Geocoding API - Search/Autocomplete
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
                `access_token=${MapboxConfig.accessToken}` +
                `&country=${MapboxConfig.region}` +
                `&language=${MapboxConfig.language}` +
                `&proximity=${MapboxConfig.locationBias.longitude},${MapboxConfig.locationBias.latitude}` +
                `&types=address,poi` +
                `&limit=5`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                return [];
            }

            return data.features.map((feature: any) => ({
                placeId: feature.id,
                description: feature.place_name,
                latitude: feature.center[1], // Mapbox uses [lng, lat]
                longitude: feature.center[0],
                formattedAddress: feature.place_name,
            }));
        } catch (error) {
            console.error('Error searching places:', error);
            throw error;
        }
    }

    async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
        try {
            // For Mapbox, we can query by place ID
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(placeId)}.json?` +
                `access_token=${MapboxConfig.accessToken}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                throw new Error('Place not found');
            }

            const feature = data.features[0];

            return {
                placeId: feature.id,
                description: feature.place_name,
                latitude: feature.center[1],
                longitude: feature.center[0],
                formattedAddress: feature.place_name,
            };
        } catch (error) {
            console.error('Error getting place details:', error);
            throw error;
        }
    }

    async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
        try {
            // Mapbox Forward Geocoding - Address to Coordinates
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` +
                `access_token=${MapboxConfig.accessToken}` +
                `&country=${MapboxConfig.region}` +
                `&proximity=${MapboxConfig.locationBias.longitude},${MapboxConfig.locationBias.latitude}` +
                `&limit=1`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                throw new Error('Address not found');
            }

            const location = data.features[0].center;

            return {
                latitude: location[1],  // Mapbox returns [lng, lat]
                longitude: location[0],
            };
        } catch (error) {
            console.error('Error geocoding address:', error);
            throw error;
        }
    }
}