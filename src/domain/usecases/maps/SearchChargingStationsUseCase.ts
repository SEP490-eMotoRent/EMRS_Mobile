import { Branch } from "../../entities/operations/Branch";
import { BranchRepository } from "../../repositories/operations/BranchRepository";

/**
 * Use Case: Search for nearby charging stations
 *
 * Business logic:
 * - Validates input parameters (lat, lon, radius)
 * - Searches for branches within the specified radius
 * - Returns branches sorted by distance (closest first)
 *
 * @example
 * const useCase = new SearchChargingStationsUseCase(branchRepository);
 * const stations = await useCase.execute(10.8024, 106.7235, 5000);
 */
export class SearchChargingStationsUseCase {
    constructor(private branchRepository: BranchRepository) {}

    /**
     * Execute the use case
     * @param latitude Current user latitude
     * @param longitude Current user longitude
     * @param radius Search radius in meters (100-10000)
     * @returns List of branches within radius, sorted by distance
     */
    async execute(
        latitude: number,
        longitude: number,
        radius: number
    ): Promise<Branch[]> {
        // Validate inputs
        this.validateInputs(latitude, longitude, radius);

        // Search for charging stations
        const branches = await this.branchRepository.searchChargingStations(
            latitude,
            longitude,
            radius
        );

        // Calculate distances and sort by proximity
        return this.sortByDistance(branches, latitude, longitude);
    }

    /**
     * Validate input parameters
     */
    private validateInputs(latitude: number, longitude: number, radius: number): void {
        if (latitude < -90 || latitude > 90) {
            throw new Error('Latitude must be between -90 and 90');
        }

        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude must be between -180 and 180');
        }

        if (radius < 100 || radius > 10000) {
            throw new Error('Radius must be between 100m and 10,000m (10km)');
        }
    }

    /**
     * Calculate distance using Haversine formula and sort branches
     */
    private sortByDistance(
        branches: Branch[],
        userLat: number,
        userLon: number
    ): Branch[] {
        return branches
            .map(branch => ({
                branch,
                distance: this.calculateDistance(
                    userLat,
                    userLon,
                    branch.latitude,
                    branch.longitude
                )
            }))
            .sort((a, b) => a.distance - b.distance)
            .map(item => item.branch);
    }

    /**
     * Calculate distance between two points using Haversine formula
     * @returns Distance in meters
     */
    private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }
}