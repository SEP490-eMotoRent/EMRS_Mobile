import { useEffect, useState } from 'react';
import { Region } from 'react-native-maps';
import sl from '../../../../core/di/InjectionContainer';
import { Branch } from '../../../../domain/entities/operations/Branch';

interface UseMapRegionProps {
    branches: Branch[];
    address?: string;
}

const DEFAULT_REGION: Region = {
    latitude: 10.8231, // Ho Chi Minh City
    longitude: 106.6297,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

export const useMapRegion = ({ branches, address }: UseMapRegionProps) => {
    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const [searchedLocation, setSearchedLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [geocoding, setGeocoding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Geocode address when it changes - THIS HAS PRIORITY
    useEffect(() => {
        if (address && address !== "1 Phạm Văn Hai, Street, Tân Bình...") {
            geocodeAddress(address);
        }
    }, [address]);

    // Center map on branches ONLY if user hasn't searched
    useEffect(() => {
        if (branches.length > 0 && !hasSearched) {
            // Filter out branches with invalid coordinates (0,0)
            const validBranches = branches.filter(
                b => b.latitude !== 0 && b.longitude !== 0
            );

            if (validBranches.length > 0) {
                const avgLat = validBranches.reduce((sum, b) => sum + b.latitude, 0) / validBranches.length;
                const avgLng = validBranches.reduce((sum, b) => sum + b.longitude, 0) / validBranches.length;
                
                setRegion({
                    latitude: avgLat,
                    longitude: avgLng,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
            }
        }
    }, [branches, hasSearched]);

    const geocodeAddress = async (addr: string) => {
        try {
            setGeocoding(true);
            setError(null);

            // Use the actual geocoding repository through dependency injection
            const geocodingRepo = sl.getGeocodingRepository();
            const coordinates = await geocodingRepo.geocodeAddress(addr);

            setSearchedLocation(coordinates);
            setHasSearched(true);
            
            setRegion({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Geocoding failed');
            console.error('Error geocoding address:', err);
            
            // Fall back to default location on error
            setSearchedLocation(null);
            setHasSearched(false);
        } finally {
            setGeocoding(false);
        }
    };

    const resetSearch = () => {
        setSearchedLocation(null);
        setHasSearched(false);
        setError(null);
    };

    return { 
        region, 
        setRegion, 
        searchedLocation, 
        resetSearch, 
        geocoding, 
        error 
    };
};