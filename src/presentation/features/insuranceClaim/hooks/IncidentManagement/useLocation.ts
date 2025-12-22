import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationData {
    address: string | null; // Can be null now
    coords: {
        latitude: number;
        longitude: number;
    } | null; // Can be null now
    isValid: boolean; // New flag to indicate if this is real GPS data
}

interface UseLocationResult {
    location: LocationData | null;
    isLoading: boolean;
    error: string | null;
    refreshLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationResult => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocation = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Location permission denied');
                setLocation({
                    address: null,
                    coords: null,
                    isValid: false,
                });
                setIsLoading(false);
                return;
            }

            // Get current position with timeout
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 5000,
                distanceInterval: 0,
            }).catch((err) => {
                // Fallback: try last known position
                // console.log('Trying last known position...');
                return Location.getLastKnownPositionAsync();
            });

            if (!position) {
                throw new Error('Unable to get location');
            }

            // Reverse geocode to get address
            try {
                const geocode = await Location.reverseGeocodeAsync({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                if (geocode.length > 0) {
                    const addr = geocode[0];
                    const addressString = [
                        addr.street,
                        addr.district,
                        addr.city,
                        addr.region,
                    ].filter(Boolean).join(', ');

                    setLocation({
                        address: addressString || null,
                        coords: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        },
                        isValid: true,
                    });
                } else {
                    // No geocoding result - we have coords but no address
                    setLocation({
                        address: null,
                        coords: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        },
                        isValid: true, // Coords are valid even without address
                    });
                }
            } catch (geocodeError) {
                // Geocoding failed - we have coords but no address
                // console.log('Geocoding failed, using coordinates only');
                setLocation({
                    address: null,
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    isValid: true, // Coords are valid even without address
                });
            }

            setIsLoading(false);
        } catch (err: any) {
            console.error('Location error:', err);
            setError(err.message || 'Failed to get location');
            
            // Complete failure - no valid data
            setLocation({
                address: null,
                coords: null,
                isValid: false,
            });
            
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    return {
        location,
        isLoading,
        error,
        refreshLocation: fetchLocation,
    };
};