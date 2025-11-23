import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Region } from 'react-native-maps';
import sl from '../../../../core/di/InjectionContainer';
import { Branch } from '../../../../domain/entities/operations/Branch';

interface UseMapRegionProps {
    branches: Branch[];
    address?: string;
}

const DEFAULT_REGION: Region = {
    latitude: 10.8231,
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

    const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastGeocodedAddressRef = useRef<string>('');
    const isMountedRef = useRef<boolean>(true);
    const hasInitializedRef = useRef<boolean>(false);

    const geocodeAddress = useCallback(async (addr: string) => {
        if (lastGeocodedAddressRef.current === addr) {
            return;
        }

        try {
            setGeocoding(true);
            setError(null);

            const geocodingRepo = sl.getGeocodingRepository();
            const coordinates = await geocodingRepo.geocodeAddress(addr);

            if (!isMountedRef.current) return;

            lastGeocodedAddressRef.current = addr;
            setSearchedLocation(coordinates);
            setHasSearched(true);
            
            setRegion({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
        } catch (err) {
            if (!isMountedRef.current) return;
            
            setError(err instanceof Error ? err.message : 'Geocoding failed');
            setSearchedLocation(null);
            setHasSearched(false);
        } finally {
            if (isMountedRef.current) {
                setGeocoding(false);
            }
        }
    }, []);

    useEffect(() => {
        if (address && address !== "1 Phạm Văn Hai, Street, Tân Bình...") {
            if (geocodeTimeoutRef.current !== null) {
                clearTimeout(geocodeTimeoutRef.current);
            }

            geocodeTimeoutRef.current = setTimeout(() => {
                geocodeAddress(address);
            }, 300);
        }

        return () => {
            if (geocodeTimeoutRef.current !== null) {
                clearTimeout(geocodeTimeoutRef.current);
            }
        };
    }, [address, geocodeAddress]);

    // ✅ CRITICAL FIX: Add Earth bounds check to filter
    const validBranches = useMemo(() => {
        const filtered = branches.filter(b => {
            const isValid = 
                b.latitude !== 0 && 
                b.longitude !== 0 && 
                !isNaN(b.latitude) && 
                !isNaN(b.longitude) &&
                b.latitude >= -90 && 
                b.latitude <= 90 &&
                b.longitude >= -180 && 
                b.longitude <= 180;
            
            if (!isValid) {
                console.warn(`⚠️ Skipping invalid branch: ${b.branchName} (lat: ${b.latitude}, lng: ${b.longitude})`);
            }
            
            return isValid;
        });
        
        console.log(`✅ Valid branches: ${filtered.length} of ${branches.length}`);
        return filtered;
    }, [branches]);

    useEffect(() => {
        if (validBranches.length > 0 && !hasSearched && !hasInitializedRef.current) {
            hasInitializedRef.current = true;
            
            let totalLat = 0;
            let totalLng = 0;
            
            for (const branch of validBranches) {
                totalLat += branch.latitude;
                totalLng += branch.longitude;
            }
            
            const avgLat = totalLat / validBranches.length;
            const avgLng = totalLng / validBranches.length;
            
            console.log('📍 Setting region:', avgLat, avgLng);
            
            setRegion({
                latitude: avgLat,
                longitude: avgLng,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
        }
    }, [validBranches, hasSearched]);

    const resetSearch = useCallback(() => {
        setSearchedLocation(null);
        setHasSearched(false);
        setError(null);
        lastGeocodedAddressRef.current = '';
    }, []);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (geocodeTimeoutRef.current !== null) {
                clearTimeout(geocodeTimeoutRef.current);
            }
        };
    }, []);

    return { 
        region, 
        setRegion, 
        searchedLocation, 
        resetSearch, 
        geocoding, 
        error 
    };
};