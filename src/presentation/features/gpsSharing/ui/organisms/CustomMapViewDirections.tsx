import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Polyline } from "react-native-maps";

type LatLng = {
  latitude: number;
  longitude: number;
};

interface CustomMapViewDirectionsProps {
  origin: LatLng | null | undefined;
  destination: LatLng | null | undefined;
  strokeColor?: string;
  strokeWidth?: number;
  /**
   * Called when a route has been successfully fetched and decoded.
   * Provides the full list of coordinates.
   */
  onRouteReady?: (coords: LatLng[]) => void;
}

export const CustomMapViewDirections: React.FC<CustomMapViewDirectionsProps> = ({
  origin,
  destination,
  strokeColor = "#0F53FF",
  strokeWidth = 4,
  onRouteReady,
}) => {
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(false);
  console.log('🗺️ origin', origin);
  useEffect(() => {
    const fetchRoute = async () => {
      if (!origin || !destination) {
        setRouteCoordinates([]);
        return;
      }

      setLoading(true);

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        const coords = data?.routes?.[0]?.geometry?.coordinates ?? [];

        if (Array.isArray(coords) && coords.length > 0) {
          const decoded: LatLng[] = coords.map(
            ([lon, lat]: [number, number]) => ({
              latitude: lat,
              longitude: lon,
            })
          );

          setRouteCoordinates(decoded);
          if (onRouteReady) {
            onRouteReady(decoded);
          }
        } else {
          // Fallback: straight line if OSRM doesn't return a route
          const fallback: LatLng[] = [
            origin,
            destination,
          ];
          setRouteCoordinates(fallback);
          if (onRouteReady) {
            onRouteReady(fallback);
          }
        }
      } catch (error) {
        // On error, also fallback to a straight line between origin & destination
        if (origin && destination) {
          const fallback: LatLng[] = [
            origin,
            destination,
          ];
          setRouteCoordinates(fallback);
          if (onRouteReady) {
            onRouteReady(fallback);
          }
        } else {
          setRouteCoordinates([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude]);

  if (!origin || !destination || routeCoordinates.length === 0) {
    return null;
  }

  // We don't actually render the ActivityIndicator on the map (it would require
  // overlaying a view); loading is tracked mostly for potential future UI hooks.
  // For now, we just render the polyline once available.

  return (
    <>
      {loading && null}
      <Polyline
        coordinates={routeCoordinates}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        lineJoin="round"
        lineCap="round"
      />
    </>
  );
};

export default CustomMapViewDirections;


