export const GoogleMapsConfig = {
    // Get from app.json or environment variable
    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual key
    
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
};