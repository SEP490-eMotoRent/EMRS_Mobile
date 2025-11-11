export interface SearchChargingStationsRequest {
    /**
     * Current latitude of the user
     * @example 10.8024
     */
    latitude: number;

    /**
     * Current longitude of the user
     * @example 106.7235
     */
    longitude: number;

    /**
     * Search radius in meters
     * Range: 100m to 10,000m (10km)
     * @example 5000
     */
    radius: number;
}

/**
 * Validates the search request parameters
 */
export function validateSearchChargingStationsRequest(
    request: SearchChargingStationsRequest
): { valid: boolean; error?: string } {
    if (!request.latitude || !request.longitude || !request.radius) {
        return { valid: false, error: 'All parameters (latitude, longitude, radius) are required' };
    }

    if (request.latitude < -90 || request.latitude > 90) {
        return { valid: false, error: 'Latitude must be between -90 and 90' };
    }

    if (request.longitude < -180 || request.longitude > 180) {
        return { valid: false, error: 'Longitude must be between -180 and 180' };
    }

    if (request.radius < 100 || request.radius > 10000) {
        return { valid: false, error: 'Radius must be between 100m and 10,000m (10km)' };
    }

    return { valid: true };
}