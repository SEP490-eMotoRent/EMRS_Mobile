// hooks/IncidentManagement/useLocation.ts (NEW)

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationData {
    address: string;
    coords: {
        latitude: number;
        longitude: number;
    };
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
                    address: 'Location permission denied',
                    coords: { latitude: 0, longitude: 0 }
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
                console.log('Trying last known position...');
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
                        address: addressString || `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
                        coords: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        },
                    });
                } else {
                    setLocation({
                        address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
                        coords: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        },
                    });
                }
            } catch (geocodeError) {
                // Geocoding failed, just use coordinates
                console.log('Geocoding failed, using coordinates');
                setLocation({
                    address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                });
            }

            setIsLoading(false);
        } catch (err: any) {
            console.error('Location error:', err);
            setError(err.message || 'Failed to get location');
            
            // Set fallback location
            setLocation({
                address: 'Unable to fetch location - Please enter manually',
                coords: { latitude: 0, longitude: 0 }
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