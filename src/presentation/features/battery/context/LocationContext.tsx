import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface LocationContextValue {
  location: LocationData | null;
  errorMsg: string | null;
  loading: boolean;
  updateLocation: () => Promise<void>;
}

interface LocationProviderProps {
  children: ReactNode;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

// DEVELOPMENT MODE: Set to FALSE to use real GPS location
const USE_MOCK_LOCATION = false; // Changed from __DEV__ to false

// Mock location for testing (Ho Chi Minh City center)
const MOCK_LOCATION: LocationData = {
  latitude: 10.8231, // Landmark 81 area
  longitude: 106.6297,
  timestamp: Date.now(),
};

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRealLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Không có quyền truy cập vị trí');
        setLoading(false);
        return;
      }

      // Get current position with timeout and fallback
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      }).catch(async (err) => {
        console.log('⚠️ Trying last known position...', err);
        // Fallback: try last known position
        return await Location.getLastKnownPositionAsync();
      });

      if (!currentLocation) {
        throw new Error('Không thể lấy vị trí');
      }

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: currentLocation.timestamp,
      });
      setErrorMsg(null);
      console.log('✅ Location updated:', {
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrorMsg(`Lỗi khi lấy vị trí: ${errorMessage}`);
      console.error('❌ Location error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      // Use mock location in development (if enabled)
      if (USE_MOCK_LOCATION) {
        console.log('🧪 Using mock location:', MOCK_LOCATION);
        setLocation(MOCK_LOCATION);
        setErrorMsg(null);
        setLoading(false);
        return;
      }

      // Production/Real GPS: Get real location
      await fetchRealLocation();
    })();
  }, []);

  const updateLocation = async (): Promise<void> => {
    // Use mock location in development (if enabled)
    if (USE_MOCK_LOCATION) {
      setLocation({
        ...MOCK_LOCATION,
        timestamp: Date.now(),
      });
      return;
    }

    // Get real location
    await fetchRealLocation();
  };

  const value: LocationContextValue = {
    location,
    errorMsg,
    loading,
    updateLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextValue => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};