import React, { useEffect, useState } from "react";
import { Polyline } from "react-native-maps";

interface RouteLineProps {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
}

interface RouteCoordinate {
    latitude: number;
    longitude: number;
}

export const RouteLine: React.FC<RouteLineProps> = ({ origin, destination }) => {
    const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
    const [distance, setDistance] = useState<string>("");
    const [duration, setDuration] = useState<string>("");

    useEffect(() => {
        fetchRoute();
    }, [origin, destination]);

    const fetchRoute = async () => {
        try {
            // TODO: Move this to environment variable
            const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.routes.length > 0) {
                const route = data.routes[0];
                const points = decodePolyline(route.overview_polyline.points);
                setRouteCoordinates(points);
                
                // Get distance and duration
                if (route.legs.length > 0) {
                    setDistance(route.legs[0].distance.text);
                    setDuration(route.legs[0].duration.text);
                }
            } else {
                // Fallback: draw straight line if API fails
                setRouteCoordinates([origin, destination]);
            }
        } catch (error) {
            console.error("Error fetching route:", error);
            // Fallback: draw straight line
            setRouteCoordinates([origin, destination]);
        }
    };

    const decodePolyline = (encoded: string): RouteCoordinate[] => {
        const poly: RouteCoordinate[] = [];
        let index = 0;
        const len = encoded.length;
        let lat = 0;
        let lng = 0;

        while (index < len) {
            let b: number;
            let shift = 0;
            let result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            poly.push({
                latitude: lat / 1e5,
                longitude: lng / 1e5,
            });
        }
        return poly;
    };

    if (routeCoordinates.length === 0) return null;

    return (
        <>
            {/* Shadow/outline */}
            <Polyline
                coordinates={routeCoordinates}
                strokeColor="#000"
                strokeWidth={6}
            />
            {/* Main route line */}
            <Polyline
                coordinates={routeCoordinates}
                strokeColor="#b8a4ff"
                strokeWidth={4}
            />
        </>
    );
};