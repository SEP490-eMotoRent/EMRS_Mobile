
// Data Sources
import { MapboxGeocodingDataSourceImpl } from "../../../data/datasources/implementations/remote/maps/MapboxGeocodingDataSourceImpl";

// Repositories
import { GeocodingRepositoryImpl } from "../../../data/repositories/maps/GeocodingRepositoryImpl";
import { GeocodingRepository } from "../../../domain/repositories/map/GeocodingRepository";

// Use Cases
import { GetPlaceDetailsUseCase } from "../../../domain/usecases/maps/GetPlaceDetailsUseCase";
import { SearchPlacesUseCase } from "../../../domain/usecases/maps/SearchPlacesUseCase";

/**
 * MapsModule - All maps and geocoding-related functionality
 * 
 * Includes:
 * - Geocoding
 * - Place search
 * - Place details
 */
export class MapsModule {
    // Data Sources
    public readonly geocodingDataSource: MapboxGeocodingDataSourceImpl;

    // Repositories
    public readonly geocodingRepository: GeocodingRepository;

    // Use Cases
    public readonly places = {
        search: {} as SearchPlacesUseCase,
        getDetails: {} as GetPlaceDetailsUseCase,
    };

    constructor() {
        // Initialize data sources
        this.geocodingDataSource = new MapboxGeocodingDataSourceImpl();

        // Initialize repositories
        this.geocodingRepository = new GeocodingRepositoryImpl(this.geocodingDataSource);

        // Initialize use cases
        this.places.search = new SearchPlacesUseCase(this.geocodingRepository);
        this.places.getDetails = new GetPlaceDetailsUseCase(this.geocodingRepository);
    }

    static create(): MapsModule {
        return new MapsModule();
    }
}