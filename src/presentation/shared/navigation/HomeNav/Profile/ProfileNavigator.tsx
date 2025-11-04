import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { EditProfileScreen } from '../../../../features/profile/ui/screens/EditProfileScreen';
import { ProfileScreen } from '../../../../features/profile/ui/screens/ProfileScreen';
import { DocumentCaptureScreen } from '../../../../features/profile/ui/screens/DocumentCaptureScreen';
import { ProfileStackParamList } from '../../StackParameters/types';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
    return (
        <Stack.Navigator id={undefined} initialRouteName="Profile" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="DocumentCapture" component={DocumentCaptureScreen} />
        </Stack.Navigator>
    );
};