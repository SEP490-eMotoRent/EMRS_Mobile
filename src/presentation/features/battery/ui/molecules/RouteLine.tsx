import React, { useEffect, useState } from "react";
import { Polyline } from "react-native-maps";
import { MapboxConfig } from "../../../../../core/config/MapboxConfig";

interface RouteLineProps {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
    onRouteData?: (distance: string, duration: string) => void;
}

interface RouteCoordinate {
    latitude: number;
    longitude: number;
}

export const RouteLine: React.FC<RouteLineProps> = ({ 
    origin, 
    destination,
    onRouteData 
}) => {
    const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRoute();
    }, [origin, destination]);

    const fetchRoute = async () => {
        try {
            setLoading(true);
            
            // Build Mapbox Directions API URL
            const { accessToken, directions } = MapboxConfig;
            const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
            const url = `${directions.baseUrl}/${directions.profile}/${coordinates}?geometries=geojson&overview=full&steps=true&language=${MapboxConfig.language}&access_token=${accessToken}`;

            console.log('🗺️ Fetching route from Mapbox...');
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.code !== 'Ok') {
                console.error('Mapbox API error:', data);
                throw new Error(data.message || 'Failed to fetch route');
            }

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                
                // Convert GeoJSON coordinates [lng, lat] to map coordinates {latitude, longitude}
                const coordinates = route.geometry.coordinates.map((coord: [number, number]) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));
                
                setRouteCoordinates(coordinates);
                console.log(`✅ Route loaded: ${coordinates.length} points`);
                
                // Pass distance and duration back to parent
                if (onRouteData) {
                    const distanceKm = (route.distance / 1000).toFixed(1);
                    const durationMin = Math.round(route.duration / 60);
                    onRouteData(`${distanceKm} km`, `${durationMin} phút`);
                }
            } else {
                console.warn('⚠️ No routes found, using fallback');
                // Fallback: straight line
                setRouteCoordinates([origin, destination]);
                if (onRouteData) {
                    onRouteData('--', '--');
                }
            }
        } catch (error) {
            console.error("❌ Error fetching route from Mapbox:", error);
            // Fallback: straight line
            setRouteCoordinates([origin, destination]);
            if (onRouteData) {
                onRouteData('--', '--');
            }
        } finally {
            setLoading(false);
        }
    };

    if (routeCoordinates.length === 0) return null;

    return (
        <>
            {/* Shadow/outline for better visibility */}
            <Polyline
                coordinates={routeCoordinates}
                strokeColor="#000"
                strokeWidth={6}
                lineJoin="round"
                lineCap="round"
            />
            {/* Main route line */}
            <Polyline
                coordinates={routeCoordinates}
                strokeColor="#b8a4ff"
                strokeWidth={4}
                lineJoin="round"
                lineCap="round"
            />
        </>
    );
};