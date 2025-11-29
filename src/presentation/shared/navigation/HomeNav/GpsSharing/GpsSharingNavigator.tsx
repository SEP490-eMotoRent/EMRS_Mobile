import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { GpsSharingSessionListScreen } from '../../../../features/gpsSharing/ui/screens';

const Stack = createStackNavigator();

export const GpsSharingNavigator: React.FC = () => {
    return (
        <Stack.Navigator 
            id={undefined} 
            initialRouteName="SessionList" 
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="SessionList" component={GpsSharingSessionListScreen} />
        </Stack.Navigator>
    );
};

