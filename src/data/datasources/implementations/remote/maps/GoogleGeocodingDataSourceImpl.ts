import { GeocodingDataSource, PlaceDetails } from '../../../interfaces/remote/maps/GeocodingDataSource';
import { GoogleMapsConfig } from '../../../../../core/config/GoogleMapsConfig';

export class GoogleGeocodingDataSourceImpl implements GeocodingDataSource {
    private readonly baseUrl = 'https://maps.googleapis.com/maps/api';
    
    async searchPlaces(query: string): Promise<PlaceDetails[]> {
        try {
            const url = `${this.baseUrl}/place/autocomplete/json?` +
                `input=${encodeURIComponent(query)}` +
                `&key=${GoogleMapsConfig.apiKey}` +
                `&language=${GoogleMapsConfig.language}` +
                `&components=country:${GoogleMapsConfig.region}` +
                `&location=${GoogleMapsConfig.locationBias.latitude},${GoogleMapsConfig.locationBias.longitude}` +
                `&radius=50000`; // 50km radius

            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== 'OK') {
                throw new Error(`Google Places API error: ${data.status}`);
            }

            return data.predictions.map((prediction: any) => ({
                placeId: prediction.place_id,
                description: prediction.description,
                latitude: 0, // Will be filled by getPlaceDetails
                longitude: 0,
                formattedAddress: prediction.description,
            }));
        } catch (error) {
            console.error('Error searching places:', error);
            throw error;
        }
    }

    async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
        try {
            const url = `${this.baseUrl}/place/details/json?` +
                `place_id=${placeId}` +
                `&key=${GoogleMapsConfig.apiKey}` +
                `&fields=geometry,formatted_address`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== 'OK') {
                throw new Error(`Google Places Details API error: ${data.status}`);
            }

            const location = data.result.geometry.location;

            return {
                placeId,
                description: data.result.formatted_address,
                latitude: location.lat,
                longitude: location.lng,
                formattedAddress: data.result.formatted_address,
            };
        } catch (error) {
            console.error('Error getting place details:', error);
            throw error;
        }
    }

    async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
        try {
            const url = `${this.baseUrl}/geocode/json?` +
                `address=${encodeURIComponent(address)}` +
                `&key=${GoogleMapsConfig.apiKey}` +
                `&region=${GoogleMapsConfig.region}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== 'OK' || data.results.length === 0) {
                throw new Error(`Geocoding failed: ${data.status}`);
            }

            const location = data.results[0].geometry.location;

            return {
                latitude: location.lat,
                longitude: location.lng,
            };
        } catch (error) {
            console.error('Error geocoding address:', error);
            throw error;
        }
    }
}