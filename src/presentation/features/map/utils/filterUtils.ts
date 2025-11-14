import { FilterState } from "../../vehicleList/ui/orgamism/FilterModal";

/**
 * Calculate number of active filters
 * Returns count of non-default filter values
 */
export const getActiveFilterCount = (filters: FilterState): number => {
    let count = 0;
    
    // Price filter is active if max is not default
    if (filters.priceRange[1] < 500000) {
        count++;
    }
    
    // Range filter is active if max is not default
    if (filters.rangeKm[1] < 150) {
        count++;
    }
    
    // Model filters
    count += filters.models.length;
    
    // Feature filters
    count += filters.features.length;
    
    return count;
};

/**
 * Get default/reset filter state
 */
export const getDefaultFilters = (): FilterState => ({
    priceRange: [0, 500000],
    models: [],
    rangeKm: [0, 150],
    features: [],
});

/**
 * Check if filters are at default state
 */
export const areFiltersDefault = (filters: FilterState): boolean => {
    return getActiveFilterCount(filters) === 0;
};

/**
 * Apply filters to branch list
 * Returns filtered branches based on filter criteria
 */
export const applyFiltersToVehicles = <T extends {
    pricePerDay?: number;
    brand?: string;
    model?: string;
    rangeKm?: number;
}>(
    vehicles: T[],
    filters: FilterState
): T[] => {
    return vehicles.filter(vehicle => {
        // Price filter
        if (vehicle.pricePerDay !== undefined) {
            if (vehicle.pricePerDay > filters.priceRange[1]) {
                return false;
            }
        }
        
        // Model/Brand filter
        if (filters.models.length > 0) {
            const vehicleBrand = (vehicle.brand || vehicle.model || '').toLowerCase();
            const matchesBrand = filters.models.some(model => 
                vehicleBrand.includes(model.toLowerCase())
            );
            if (!matchesBrand) {
                return false;
            }
        }
        
        // Range filter
        if (vehicle.rangeKm !== undefined) {
            if (vehicle.rangeKm > filters.rangeKm[1]) {
                return false;
            }
        }
        
        return true;
    });
};