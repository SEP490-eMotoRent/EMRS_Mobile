import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { MapScreen } from '../../../../features/map/ui/screens/MapScreen';
import { VehicleDetailsScreen } from '../../../../features/vehicleDetails/ui/screens/VehicleDetailsScreen';
import { ListView } from '../../../../features/vehicleList/ui/screens/ListViewScreen';
import { BrowseStackParamList } from '../../StackParameters/types';

import { DocumentCaptureScreen } from '../../../../features/profile/ui/screens/DocumentCaptureScreen';
import { CitizenIDVerificationScreen } from '../../../../features/profile/ui/screens/Documents/CitizenIDVerificationScreen';
import { DocumentManagementHubScreen } from '../../../../features/profile/ui/screens/Documents/DocumentManagementHubScreen';
import { DriverLicenseVerificationScreen } from '../../../../features/profile/ui/screens/Documents/DriverLicenseVerificationScreen';

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

            {/* Document Management Screens */}
            <Stack.Screen name="DocumentManagement" component={DocumentManagementHubScreen} />
            <Stack.Screen name="CitizenIDVerification" component={CitizenIDVerificationScreen} />
            <Stack.Screen name="DriverLicenseVerification" component={DriverLicenseVerificationScreen} />
            <Stack.Screen name="DocumentCapture" component={DocumentCaptureScreen} />
        </Stack.Navigator>
    );
};