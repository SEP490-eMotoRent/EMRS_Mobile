import { useState } from 'react';
import { PlaceDetails } from '../../../../../data/datasources/interfaces/remote/maps/GeocodingDataSource';
import sl from '../../../../../core/di/InjectionContainer';

export const usePlaces = () => {  // <-- Renamed
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<PlaceDetails[]>([]);
    const [error, setError] = useState<string | null>(null);

    const searchPlaces = async (query: string) => {
        if (!query || query.trim().length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);
            setError(null);
            const useCase = sl.getSearchPlacesUseCase();
            const results = await useCase.execute(query);
            setSearchResults(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
            console.error('Error searching places:', err);
        } finally {
            setSearching(false);
        }
    };

    const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
        try {
            const useCase = sl.getGetPlaceDetailsUseCase();
            return await useCase.execute(placeId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get place details');
            console.error('Error getting place details:', err);
            return null;
        }
    };

    const clearResults = () => {
        setSearchResults([]);
        setError(null);
    };

    return {
        searching,
        searchResults,
        error,
        searchPlaces,
        getPlaceDetails,
        clearResults,
    };
};