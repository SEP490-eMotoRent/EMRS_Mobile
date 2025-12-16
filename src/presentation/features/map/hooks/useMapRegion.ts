import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { InteractionManager } from 'react-native';
import { Region } from 'react-native-maps';
import sl from '../../../../core/di/InjectionContainer';
import { Branch } from '../../../../domain/entities/operations/Branch';

interface UseMapRegionProps {
    branches: Branch[];
    address?: string;
}

const DEFAULT_REGION: Region = {
    latitude: 10.8231,      // Ho Chi Minh City center
    longitude: 106.6297,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

    // Refs for managing async operations and preventing race conditions
    const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastGeocodedAddressRef = useRef<string>('');
    const isMountedRef = useRef<boolean>(true);
    const hasInitializedRef = useRef<boolean>(false);
    const currentGeocodeIdRef = useRef<number>(0);

    /**
     * Filter branches with valid coordinates
     * Memoized to prevent recalculation on every render
     */
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
            
            return isValid;
        });
        
        console.log(`✅ Valid branches: ${filtered.length}/${branches.length}`);
        return filtered;
    }, [branches]);

    /**
     * Show only closest branches for performance
     * Limits to 15 markers to prevent performance issues
     * 
     * Note: Currently not used in MapScreen, but available for future optimization
     */
    const visibleBranches = useMemo(() => {
        const MAX_VISIBLE = 15;
        
        if (validBranches.length <= MAX_VISIBLE) {
            return validBranches;
        }

        const branchesWithDistance = validBranches.map(branch => ({
            branch,
            distance: calculateDistance(
                region.latitude,
                region.longitude,
                branch.latitude,
                branch.longitude
            )
        }));

        branchesWithDistance.sort((a, b) => a.distance - b.distance);
        const closest = branchesWithDistance.slice(0, MAX_VISIBLE).map(item => item.branch);
        
        console.log(`📍 Showing ${closest.length} closest branches`);
        return closest;
    }, [validBranches, region.latitude, region.longitude]);

    /**
     * Geocode address with race condition prevention and error handling
     * 
     * Critical fixes:
     * 1. Use InteractionManager to defer state updates until after animations
     * 2. Check request ID to prevent race conditions
     * 3. Gracefully handle geocoding failures without crashing
     */
    const geocodeAddress = useCallback(async (addr: string, requestId: number) => {
        // Skip if already geocoded this address
        if (lastGeocodedAddressRef.current === addr) {
            return;
        }

        try {
            setGeocoding(true);
            setError(null);

            const geocodingRepo = sl.getGeocodingRepository();
            const coordinates = await geocodingRepo.geocodeAddress(addr);

            // Check if request is still valid (prevents race conditions)
            if (!isMountedRef.current || currentGeocodeIdRef.current !== requestId) {
                console.log('⏭️ Geocode outdated, skipping');
                return;
            }

            // CRITICAL: Wait for ongoing interactions/animations to complete
            // This prevents geocoding from triggering state updates during animations
            InteractionManager.runAfterInteractions(() => {
                // Double-check component is still mounted and request is still valid
                if (!isMountedRef.current || currentGeocodeIdRef.current !== requestId) {
                    console.log('⏭️ Geocode outdated after interaction, skipping');
                    return;
                }

                lastGeocodedAddressRef.current = addr;
                setSearchedLocation(coordinates);
                setHasSearched(true);
                
                // Update map region to show geocoded location
                setRegion(prev => ({
                    ...prev,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }));

                console.log(`✅ Geocoded: ${addr} -> ${coordinates.latitude}, ${coordinates.longitude}`);
            });
        } catch (err: any) {
            // CRITICAL: Always catch and handle geocoding errors gracefully
            console.warn('⚠️ Geocoding failed:', err.message || err);

            if (!isMountedRef.current || currentGeocodeIdRef.current !== requestId) {
                return;
            }

            // Don't set error state for common location unavailable errors
            // This prevents showing error messages when geocoding simply can't find the location
            if (err.message?.includes?.('location') || err.message?.includes?.('unavailable')) {
                console.log('📍 Location unavailable, using branch average');
            } else {
                // Only set error for unexpected failures
                InteractionManager.runAfterInteractions(() => {
                    if (isMountedRef.current && currentGeocodeIdRef.current === requestId) {
                        setError('Không thể tìm vị trí. Đang dùng vị trí mặc định.');
                    }
                });
            }

            setSearchedLocation(null);
            setHasSearched(false);
        } finally {
            if (isMountedRef.current && currentGeocodeIdRef.current === requestId) {
                setGeocoding(false);
            }
        }
    }, []);

    /**
     * Debounced geocoding on address change
     * Waits 500ms after last address change before geocoding
     */
    useEffect(() => {
        // Skip default/placeholder address
        if (!address || address === "1 Phạm Văn Hai, Street, Tân Bình...") {
            return;
        }

        // Clear previous timeout
        if (geocodeTimeoutRef.current !== null) {
            clearTimeout(geocodeTimeoutRef.current);
        }

        // Increment request ID for race condition detection
        currentGeocodeIdRef.current += 1;
        const requestId = currentGeocodeIdRef.current;

        // Debounce: wait 500ms before geocoding
        geocodeTimeoutRef.current = setTimeout(() => {
            geocodeAddress(address, requestId);
        }, 500);

        return () => {
            if (geocodeTimeoutRef.current !== null) {
                clearTimeout(geocodeTimeoutRef.current);
            }
        };
    }, [address, geocodeAddress]);

    /**
     * Initialize map to average of branches if no search performed
     * This centers the map on the average location of all branches
     */
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
            
            setRegion({
                latitude: avgLat,
                longitude: avgLng,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });

            console.log(`🗺️ Map initialized to branch average: ${avgLat.toFixed(6)}, ${avgLng.toFixed(6)}`);
        }
    }, [validBranches, hasSearched]);

    /**
     * Reset search state
     */
    const resetSearch = useCallback(() => {
        setSearchedLocation(null);
        setHasSearched(false);
        setError(null);
        lastGeocodedAddressRef.current = '';
        hasInitializedRef.current = false;
    }, []);

    /**
     * Cleanup on unmount
     */
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
        error,
        visibleBranches, // Available for future optimization
    };
};