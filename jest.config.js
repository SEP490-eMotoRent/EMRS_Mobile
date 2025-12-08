    module.exports = {
    // NO PRESET - we configure everything manually
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    
    // Use ts-jest instead of babel-jest - bypasses ALL babel issues
    preset: 'ts-jest',
    
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
        tsconfig: {
            jsx: 'react',
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
        },
        }],
    },
    
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo)/)',
    ],
    
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    
    testMatch: [
        '**/__tests__/**/*.test.ts?(x)',
    ],
    
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testEnvironment: 'node',
    
    setupFiles: [],
};