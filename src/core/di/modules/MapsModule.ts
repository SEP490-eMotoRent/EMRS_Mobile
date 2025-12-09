import { MapboxGeocodingDataSourceImpl } from '../../../data/datasources/implementations/remote/maps/MapboxGeocodingDataSourceImpl';
import { GeocodingRepositoryImpl } from '../../../data/repositories/maps/GeocodingRepositoryImpl';
import { GetPlaceDetailsUseCase } from '../../../domain/usecases/maps/GetPlaceDetailsUseCase';
import { SearchPlacesUseCase } from '../../../domain/usecases/maps/SearchPlacesUseCase';

/**
 * MapsModule - Complete Maps Domain
 * 
 * Handles all mapping and geocoding functionality:
 * - Place search (Mapbox)
 * - Place details
 * - Geocoding
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class MapsModule {
    private _geocodingRepository: GeocodingRepositoryImpl | null = null;
    private _searchPlacesUseCase: SearchPlacesUseCase | null = null;
    private _getPlaceDetailsUseCase: GetPlaceDetailsUseCase | null = null;

    static create(): MapsModule {
        return new MapsModule();
    }

    get repository(): GeocodingRepositoryImpl {
        if (!this._geocodingRepository) {
        const dataSource = new MapboxGeocodingDataSourceImpl();
        this._geocodingRepository = new GeocodingRepositoryImpl(dataSource);
        }
        return this._geocodingRepository;
    }

    /**
     * Usage: container.maps.search.execute()
     */
    get search(): SearchPlacesUseCase {
        if (!this._searchPlacesUseCase) {
        this._searchPlacesUseCase = new SearchPlacesUseCase(this.repository);
        }
        return this._searchPlacesUseCase;
    }

    /**
     * Usage: container.maps.getDetails.execute()
     */
    get getDetails(): GetPlaceDetailsUseCase {
        if (!this._getPlaceDetailsUseCase) {
        this._getPlaceDetailsUseCase = new GetPlaceDetailsUseCase(this.repository);
        }
        return this._getPlaceDetailsUseCase;
    }
}