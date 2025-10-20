import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { MapScreen } from '../../../features/map/ui/screens/MapScreen';
import { ListView } from '../../../features/renterVehicleList/ui/screens/ListViewScreen';
import { VehicleDetailsScreen } from '../../../features/vehicleDetails/ui/screens/VehicleDetailsScreen';
import { BrowseStackParamList } from '../StackParameters/types';

const Stack = createStackNavigator<BrowseStackParamList>();

export const BrowseNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            id={undefined}
            initialRouteName="Map"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="ListView" component={ListView} />
            <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
        </Stack.Navigator>
    );
};