import { useMemo } from 'react';
import { Region } from 'react-native-maps';
import { Branch } from '../../../../domain/entities/operations/Branch';

interface ClusteredMarker {
    id: string;
    latitude: number;
    longitude: number;
    type: 'branch' | 'cluster';
    branches: Branch[]; // For clusters, this contains all branches in the cluster
    count: number;
}

interface UseMapClusteringProps {
    branches: Branch[];
    region: Region;
}

export const useMapClustering = ({ branches, region }: UseMapClusteringProps) => {
    const clusteredMarkers = useMemo(() => {
        // Determine zoom level from latitudeDelta
        // Smaller delta = more zoomed in
        const zoomLevel = getZoomLevel(region.latitudeDelta);
        
        // Don't cluster if zoomed in enough (zoom level > 14)
        if (zoomLevel > 14) {
            return branches.map(branch => ({
                id: branch.id,
                latitude: branch.latitude,
                longitude: branch.longitude,
                type: 'branch' as const,
                branches: [branch],
                count: 1,
            }));
        }
        
        // Cluster markers based on zoom level
        return clusterBranches(branches, zoomLevel);
    }, [branches, region.latitudeDelta]);
    
    return { clusteredMarkers };
};

/**
 * Converts latitudeDelta to approximate zoom level
 * Google Maps zoom levels: 0 (world) to 20 (building)
 */
const getZoomLevel = (latitudeDelta: number): number => {
    return Math.round(Math.log(360 / latitudeDelta) / Math.LN2);
};

/**
 * Simple grid-based clustering algorithm
 */
const clusterBranches = (branches: Branch[], zoomLevel: number): ClusteredMarker[] => {
    // Cluster size in degrees (smaller = tighter clusters)
    // At zoom 10, use 0.1° grid (~11km)
    // At zoom 12, use 0.05° grid (~5.5km)
    const gridSize = 0.2 / Math.pow(2, zoomLevel - 8);
    
    // Group branches into grid cells
    const grid: { [key: string]: Branch[] } = {};
    
    branches.forEach(branch => {
        // Skip invalid coordinates
        if (branch.latitude === 0 && branch.longitude === 0) return;
        
        // Calculate grid cell key
        const latKey = Math.floor(branch.latitude / gridSize);
        const lngKey = Math.floor(branch.longitude / gridSize);
        const cellKey = `${latKey},${lngKey}`;
        
        if (!grid[cellKey]) {
            grid[cellKey] = [];
        }
        grid[cellKey].push(branch);
    });
    
    // Convert grid cells to clustered markers
    const markers: ClusteredMarker[] = [];
    
    Object.values(grid).forEach((cellBranches) => {
        if (cellBranches.length === 1) {
            // Single branch - show as individual marker
            const branch = cellBranches[0];
            markers.push({
                id: branch.id,
                latitude: branch.latitude,
                longitude: branch.longitude,
                type: 'branch',
                branches: [branch],
                count: 1,
            });
        } else {
            // Multiple branches - show as cluster
            // Calculate centroid
            const avgLat = cellBranches.reduce((sum, b) => sum + b.latitude, 0) / cellBranches.length;
            const avgLng = cellBranches.reduce((sum, b) => sum + b.longitude, 0) / cellBranches.length;
            
            markers.push({
                id: `cluster_${cellBranches.map(b => b.id).join('_')}`,
                latitude: avgLat,
                longitude: avgLng,
                type: 'cluster',
                branches: cellBranches,
                count: cellBranches.length,
            });
        }
    });
    
    return markers;
};