import { GeocodingDataSource, PlaceDetails } from '../../../interfaces/remote/maps/GeocodingDataSource';
import { MapboxConfig } from '../../../../../core/config/MapboxConfig';

export class MapboxGeocodingDataSourceImpl implements GeocodingDataSource {
    private readonly baseUrl = 'https://api.mapbox.com';
    
    async searchPlaces(query: string): Promise<PlaceDetails[]> {
        try {
            console.log('🔍 [Mapbox] Searching places for:', query);
            
            // Mapbox Geocoding API - Search/Autocomplete
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
                `access_token=${MapboxConfig.accessToken}` +
                `&country=${MapboxConfig.region}` +
                `&language=${MapboxConfig.language}` +
                `&proximity=${MapboxConfig.locationBias.longitude},${MapboxConfig.locationBias.latitude}` +
                `&types=address,poi` +
                `&limit=5`;

            console.log('📡 [Mapbox] API URL:', url.replace(MapboxConfig.accessToken, 'TOKEN'));

            const response = await fetch(url);
            const data = await response.json();

            console.log('📨 [Mapbox] Search response:', {
                query,
                features: data.features?.length || 0,
            });

            if (!data.features || data.features.length === 0) {
                console.warn('⚠️ [Mapbox] No results found for:', query);
                return [];
            }

            const results = data.features.map((feature: any) => ({
                placeId: feature.id,
                description: feature.place_name,
                latitude: feature.center[1], // Mapbox uses [lng, lat]
                longitude: feature.center[0],
                formattedAddress: feature.place_name,
            }));

            console.log('✅ [Mapbox] Returning', results.length, 'results');
            return results;
            
        } catch (error) {
            console.error('❌ [Mapbox] Error searching places:', error);
            throw error;
        }
    }

    async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
        try {
            console.log('🔍 [Mapbox] Getting place details for:', placeId);
            
            // For Mapbox, we can query by place ID
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(placeId)}.json?` +
                `access_token=${MapboxConfig.accessToken}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                throw new Error('Place not found');
            }

            const feature = data.features[0];

            console.log('✅ [Mapbox] Place details:', feature.place_name);

            return {
                placeId: feature.id,
                description: feature.place_name,
                latitude: feature.center[1],
                longitude: feature.center[0],
                formattedAddress: feature.place_name,
            };
        } catch (error) {
            console.error('❌ [Mapbox] Error getting place details:', error);
            throw error;
        }
    }

    async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
        try {
            console.log('🌍 [Mapbox] Geocoding address:', address);
            
            // Mapbox Forward Geocoding - Address to Coordinates
            const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` +
                `access_token=${MapboxConfig.accessToken}` +
                `&country=${MapboxConfig.region}` +
                `&language=${MapboxConfig.language}` + // ✅ ADDED: Language for better results
                `&proximity=${MapboxConfig.locationBias.longitude},${MapboxConfig.locationBias.latitude}` +
                `&limit=1`;

            console.log('📡 [Mapbox] Geocoding URL:', url.replace(MapboxConfig.accessToken, 'TOKEN'));

            const response = await fetch(url);
            
            if (!response.ok) {
                console.error('❌ [Mapbox] HTTP Error:', response.status, response.statusText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();

            console.log('📨 [Mapbox] Geocoding response:', {
                query: address,
                features: data.features?.length || 0,
                firstResult: data.features?.[0]?.place_name,
            });

            if (!data.features || data.features.length === 0) {
                console.warn('⚠️ [Mapbox] No results found for address:', address);
                throw new Error('Address not found');
            }

            const location = data.features[0].center;
            const result = {
                latitude: location[1],  // Mapbox returns [lng, lat]
                longitude: location[0],
            };

            console.log('✅ [Mapbox] Geocoded to:', result);
            console.log('   Formatted address:', data.features[0].place_name);

            // ✅ Validate coordinates are in Vietnam
            if (!this.isInVietnam(result.latitude, result.longitude)) {
                console.warn('⚠️ [Mapbox] Result outside Vietnam!');
                console.warn('   Query:', address);
                console.warn('   Result:', data.features[0].place_name);
                console.warn('   Coords:', result);
            }

            return result;
            
        } catch (error) {
            console.error('❌ [Mapbox] Error geocoding address:', error);
            throw error;
        }
    }

    /**
     * Check if coordinates are within Vietnam bounds
     */
    private isInVietnam(lat: number, lng: number): boolean {
        return (
            lat >= 8 && lat <= 24 &&    // Vietnam latitude range
            lng >= 102 && lng <= 110     // Vietnam longitude range
        );
    }
}