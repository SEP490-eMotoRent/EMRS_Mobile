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

// DEVELOPMENT MODE: Set to true to use mock location
const USE_MOCK_LOCATION = __DEV__; // Automatically uses mock in dev mode

// Mock location for testing (Ho Chi Minh City center)
const MOCK_LOCATION: LocationData = {
  latitude: 10.8231, // Landmark 81 area
  longitude: 106.6297,
  timestamp: Date.now(),
};

// You can also set specific locations for testing:
// District 1: { latitude: 10.7769, longitude: 106.7009 }
// Cho Ben Thanh: { latitude: 10.7724, longitude: 106.6980 }
// Crescent Mall area: { latitude: 10.7295, longitude: 106.7192 }

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      // Use mock location in development
      if (USE_MOCK_LOCATION) {
        console.log('🧪 Using mock location:', MOCK_LOCATION);
        setLocation(MOCK_LOCATION);
        setErrorMsg(null);
        setLoading(false);
        return;
      }

      // Production: Get real location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Không có quyền truy cập vị trí');
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          timestamp: currentLocation.timestamp,
        });
        setErrorMsg(null);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setErrorMsg(`Lỗi khi lấy vị trí: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateLocation = async (): Promise<void> => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      // Use mock location in development
      if (USE_MOCK_LOCATION) {
        setLocation({
          ...MOCK_LOCATION,
          timestamp: Date.now(),
        });
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: currentLocation.timestamp,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrorMsg(`Error updating location: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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