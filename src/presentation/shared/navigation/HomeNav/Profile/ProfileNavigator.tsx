// src/shared/navigation/StackNavigators/ProfileNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { EditProfileScreen } from '../../../../features/profile/ui/screens/EditProfileScreen';
import { ProfileScreen } from '../../../../features/profile/ui/screens/ProfileScreen';
import { DocumentCaptureScreen } from '../../../../features/profile/ui/screens/DocumentCaptureScreen';
import { ProfileStackParamList } from '../../StackParameters/types';
import { InsuranceClaimDetailScreen } from '../../../../features/profile/ui/screens/MyClaims/InsuranceClaimDetailScreen';
import { InsuranceClaimsScreen } from '../../../../features/profile/ui/screens/MyClaims/InsuranceClaimsScreen';
import { CreateWithdrawalRequestScreen } from '../../../../features/profile/ui/screens/Withdrawal/CreateWithdrawalRequestScreen';
import { WithdrawalRequestDetailScreen } from '../../../../features/profile/ui/screens/Withdrawal/WithdrawalRequestDetailScreen';
import { WithdrawalRequestListScreen } from '../../../../features/profile/ui/screens/Withdrawal/WithdrawalRequestListScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
    return (
        <Stack.Navigator id={undefined} initialRouteName="Profile" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="DocumentCapture" component={DocumentCaptureScreen} />
            <Stack.Screen name="InsuranceClaims" component={InsuranceClaimsScreen} />
            <Stack.Screen name="InsuranceClaimDetail" component={InsuranceClaimDetailScreen} />
            
            {/* Withdrawal Request Screens */}
            <Stack.Screen name="CreateWithdrawalRequest" component={CreateWithdrawalRequestScreen} />
            <Stack.Screen name="WithdrawalRequestList" component={WithdrawalRequestListScreen} />
            <Stack.Screen name="WithdrawalRequestDetail" component={WithdrawalRequestDetailScreen} />
        </Stack.Navigator>
    );
};