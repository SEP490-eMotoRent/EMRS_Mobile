// src/features/auth/screens/OTPVerificationScreen/OTPVerificationScreen.tsx
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { colors } from '../../../../../common/theme/colors';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { BrandTitle } from '../../atoms/BrandTitle';
import { OTPForm } from '../../organism/otp/OTPForm';

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC = () => {
    const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
    const route = useRoute<OTPVerificationScreenRouteProp>();
    const [loading, setLoading] = useState(false);

    const { email, userId } = route.params;

    const handleVerify = async (code: string) => {
        try {
            setLoading(true);

            // TODO: Call OTP verification API when backend is ready
            console.log('Verifying OTP:', { code, userId, email });

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // ✅ SUCCESS: Just navigate to Login
            navigation.navigate('Login');

        } catch (error: any) {
            Alert.alert('Verification Failed', error.message || 'Invalid code');
            console.error('❌ OTP verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            // TODO: Call resend OTP API when backend is ready
            console.log('Resending OTP to:', email);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            Alert.alert('Success', 'Verification code sent!');
        } catch (error: any) {
            Alert.alert('Error', 'Failed to resend code');
            console.error('❌ Resend OTP error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    
                    <BackButton onPress={() => navigation.goBack()} />

                    <BrandTitle subtitle="" />

                    <OTPForm 
                        onVerify={handleVerify}
                        onResend={handleResend}
                        loading={loading}
                        email={email}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
});