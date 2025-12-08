module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
        // Only use reanimated plugin when NOT testing
        process.env.NODE_ENV !== 'test' && 'react-native-reanimated/plugin',
        ].filter(Boolean),
    };
};