export interface PlaceDetails {
    placeId: string;
    description: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
}

export interface GeocodingDataSource {
    searchPlaces(query: string): Promise<PlaceDetails[]>;
    getPlaceDetails(placeId: string): Promise<PlaceDetails>;
    geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }>;
}