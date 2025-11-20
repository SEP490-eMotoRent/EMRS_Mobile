export const MapboxConfig = {
    // Get your free token from: https://account.mapbox.com/access-tokens/
    // NO CREDIT CARD REQUIRED for basic tier
    accessToken: 'pk.eyJ1IjoiZ21ib2kiLCJhIjoiY21pNjFsdHVqMWd2dzJtcXdmYnpub3BmZiJ9.vk8zVgGEmDEGoBo-nvybQg', // NEW TOKEN
    
    // Vietnam-specific settings
    region: 'vn',
    language: 'vi',
    
    // Ho Chi Minh City bounds for better search results
    locationBias: {
        latitude: 10.8231,
        longitude: 106.6297,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    },
    
    // API Endpoints
    directions: {
        baseUrl: 'https://api.mapbox.com/directions/v5/mapbox',
        profile: 'driving', // Options: driving, driving-traffic, walking, cycling
        // driving-traffic gives real-time traffic data (if available in Vietnam)
    },
    
    geocoding: {
        baseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
        types: 'address,poi', // Filter result types
    },
    
    // Free tier limits (plenty for development):
    // - 50,000 map loads/month
    // - 100,000 geocoding requests/month
    // - 100,000 directions requests/month (NEW!)
    limits: {
        mapLoads: 50000,
        geocoding: 100000,
        directions: 100000,
    },
};