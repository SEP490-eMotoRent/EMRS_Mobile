import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { EditProfileScreen } from '../../../features/profile/ui/screens/EditProfileScreen';
import { ProfileScreen } from '../../../features/profile/ui/screens/ProfileScreen';
import { ProfileStackParamList } from '../StackParameters/types';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
    return (
        <Stack.Navigator id="ProfileStack" initialRouteName="Profile" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>

    );
};