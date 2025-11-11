import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { BranchMapScreen } from '../../../../features/battery/ui/screens/BranchMapScreen';

const Stack = createStackNavigator();

export const BatteryNavigator: React.FC = () => {
    return (
        <Stack.Navigator 
            id={undefined} 
            initialRouteName="BranchMap" 
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="BranchMap" component={BranchMapScreen} />
        </Stack.Navigator>
    );
};

