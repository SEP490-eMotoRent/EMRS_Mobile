import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import sl from '../../../../../../core/di/InjectionContainer';
import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { colors } from '../../../../../common/theme/colors';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { BrandTitle } from '../../atoms/BrandTitle';
import { OTPForm } from '../../organism/otp/OTPForm';

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

const isEmailAlreadyVerifiedError = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes('already verified') || 
           lowerMessage.includes('đã được xác minh') ||
           lowerMessage.includes('đã xác minh');
};

export const OTPVerificationScreen: React.FC = () => {
    const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
    const route = useRoute<OTPVerificationScreenRouteProp>();
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [verifyError, setVerifyError] = useState<string>('');
    const [resendError, setResendError] = useState<string>('');

    const { email, userId } = route.params;

    const handleVerify = async (code: string) => {
        try {
            setLoading(true);
            setVerifyError(''); // Clear previous errors

            const verifyOtpUseCase = sl.getVerifyOtpUseCase();
            const response = await verifyOtpUseCase.execute(email, code);

            if (response.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Xác minh thành công',
                    text2: 'Bạn có thể đăng nhập ngay bây giờ!',
                });

                // Navigate to Login after short delay for toast visibility
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 500);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Mã OTP không hợp lệ hoặc đã hết hạn';
            
            if (isEmailAlreadyVerifiedError(errorMessage)) {
                setVerifyError('Email này đã được xác minh rồi. Vui lòng đăng ký với email khác hoặc đăng nhập.');
            } else {
                setVerifyError('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
            }
            
            console.error('OTP verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            setResendError(''); // Clear previous errors

            const resendOtpUseCase = sl.getResendOtpUseCase();
            const response = await resendOtpUseCase.execute(email);

            if (response.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Đã gửi lại mã',
                    text2: 'Vui lòng kiểm tra email của bạn',
                });
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Không thể gửi lại mã OTP';
            
            if (isEmailAlreadyVerifiedError(errorMessage)) {
                setResendError('Email này đã được xác minh rồi. Vui lòng đăng ký với email khác.');
            } else {
                setResendError('Không thể gửi lại mã. Vui lòng thử lại sau.');
            }
            
            console.error('Resend OTP error:', error);
        } finally {
            setResending(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={false}>
                    
                    <BackButton onPress={() => navigation.goBack()} />

                    <BrandTitle subtitle="Xác minh địa chỉ email của bạn" />

                    <OTPForm 
                        onVerify={handleVerify}
                        onResend={handleResend}
                        loading={loading}
                        resending={resending}
                        email={email}
                        verifyError={verifyError}
                        resendError={resendError}
                        onErrorDismiss={() => {
                            setVerifyError('');
                            setResendError('');
                        }}
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