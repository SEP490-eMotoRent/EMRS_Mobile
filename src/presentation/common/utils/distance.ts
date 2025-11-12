/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * 
 * @param lat1 - Latitude of first point (in degrees)
 * @param lon1 - Longitude of first point (in degrees)
 * @param lat2 - Latitude of second point (in degrees)
 * @param lon2 - Longitude of second point (in degrees)
 * @returns Distance in kilometers
 * 
 * @example
 * const distance = calculateDistance(
 *   10.8231, 106.6297,  // Ho Chi Minh City
 *   10.8024, 106.7235   // Branch location
 * );
 * console.log(distance); // ~8.5 km
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    // Earth's radius in kilometers
    const R = 6371;
    
    // Convert degrees to radians
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    // Haversine formula
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * 
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate distance and format for display
 * 
 * @example
 * formatDistance(10.8231, 106.6297, 10.8024, 106.7235)
 * // Returns: "8.50"
 */
export function formatDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): string {
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    return distance.toFixed(2);
}

/**
 * Calculate distance from a point to multiple locations
 * Returns array of distances in the same order as input locations
 * 
 * @example
 * const userLocation = { lat: 10.8231, lon: 106.6297 };
 * const branches = [
 *   { lat: 10.8024, lon: 106.7235 },
 *   { lat: 10.805, lon: 106.7335 }
 * ];
 * 
 * const distances = calculateDistances(
 *   userLocation.lat,
 *   userLocation.lon,
 *   branches
 * );
 * // Returns: [8.50, 9.20]
 */
export function calculateDistances(
    originLat: number,
    originLon: number,
    locations: Array<{ latitude: number; longitude: number }>
): number[] {
    return locations.map(loc => 
        calculateDistance(originLat, originLon, loc.latitude, loc.longitude)
    );
}

/**
 * Find the nearest location from a list
 * 
 * @example
 * const nearest = findNearest(
 *   10.8231, 106.6297,
 *   branches
 * );
 * // Returns: { location: Branch, distance: 8.50 }
 */
export function findNearest<T extends { latitude: number; longitude: number }>(
    originLat: number,
    originLon: number,
    locations: T[]
): { location: T; distance: number } | null {
    if (locations.length === 0) return null;
    
    let nearest = locations[0];
    let minDistance = calculateDistance(
        originLat,
        originLon,
        nearest.latitude,
        nearest.longitude
    );
    
    for (let i = 1; i < locations.length; i++) {
        const distance = calculateDistance(
            originLat,
            originLon,
            locations[i].latitude,
            locations[i].longitude
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            nearest = locations[i];
        }
    }
    
    return { location: nearest, distance: minDistance };
}