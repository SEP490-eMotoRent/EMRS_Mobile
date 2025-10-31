export const MapboxConfig = {
    // Get your free token from: https://account.mapbox.com/access-tokens/
    // NO CREDIT CARD REQUIRED for basic tier
    accessToken: 'pk.eyJ1IjoiZ21ib2kiLCJhIjoiY21oZDlnMzZ4MDBpdjJrcjVxYnkycmY1MSJ9.elPlOG2OFRQBfXw2WnPqYA', // Starts with 'pk.'
    
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
    
    // Free tier limits (plenty for development):
    // - 50,000 map loads/month
    // - 100,000 geocoding requests/month
};