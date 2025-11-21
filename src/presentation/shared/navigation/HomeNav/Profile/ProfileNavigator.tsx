import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { DocumentCaptureScreen } from '../../../../features/profile/ui/screens/DocumentCaptureScreen';
import { EditProfileScreen } from '../../../../features/profile/ui/screens/EditProfileScreen';
import { InsuranceClaimDetailScreen } from '../../../../features/profile/ui/screens/MyClaims/InsuranceClaimDetailScreen';
import { InsuranceClaimsScreen } from '../../../../features/profile/ui/screens/MyClaims/InsuranceClaimsScreen';
import { ProfileScreen } from '../../../../features/profile/ui/screens/ProfileScreen';
import { WalletTopUpResultScreen } from '../../../../features/profile/ui/screens/WalletTopUp/WalletTopUpResultScreen';
import { WalletTopUpScreen } from '../../../../features/profile/ui/screens/WalletTopUp/WalletTopUpScreen';
import { WalletVNPayWebViewScreen } from '../../../../features/profile/ui/screens/WalletTopUp/WalletVNPayWebViewScreen';
import { CreateWithdrawalRequestScreen } from '../../../../features/profile/ui/screens/Withdrawal/CreateWithdrawalRequestScreen';
import { WithdrawalRequestDetailScreen } from '../../../../features/profile/ui/screens/Withdrawal/WithdrawalRequestDetailScreen';
import { WithdrawalRequestListScreen } from '../../../../features/profile/ui/screens/Withdrawal/WithdrawalRequestListScreen';
import { ProfileStackParamList } from '../../StackParameters/types';

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

            {/* Wallet Top-Up Screens */}
            <Stack.Screen name="WalletTopUp" component={WalletTopUpScreen} />
            <Stack.Screen name="WalletVNPayWebView" component={WalletVNPayWebViewScreen} />
            <Stack.Screen name="WalletTopUpResult" component={WalletTopUpResultScreen} />
        </Stack.Navigator>
    );
};