/**
 * @fileoverview Custom hook for handling OTP verification flow
 * @module features/account/presentation/store/hooks/otp/useOTPVerification
 */

import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { container } from '../../../../../../core/di/ServiceContainer';  // ✅ NEW
import { AuthStackParamList, RootStackParamList } from '../../../../../shared/navigation/StackParameters/types';

type OtpNavigationProp = CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList, 'Login'>,
    StackNavigationProp<RootStackParamList>
>;

interface UseOtpVerificationReturn {
    showEmailModal: boolean;
    pendingUsername: string;
    resendingOtp: boolean;
    openEmailModal: (username: string) => void;
    closeEmailModal: () => void;
    resendOtp: (email: string) => Promise<void>;
}

export const useOtpVerification = (): UseOtpVerificationReturn => {
    const navigation = useNavigation<OtpNavigationProp>();
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [pendingUsername, setPendingUsername] = useState('');
    const [resendingOtp, setResendingOtp] = useState(false);

    const openEmailModal = (username: string) => {
        setPendingUsername(username);
        Alert.alert(
            'Xác minh email',
            'Tài khoản của bạn chưa được xác minh. Vui lòng nhập mã OTP đã gửi đến email của bạn.',
            [
                {
                    text: 'Xác minh ngay',
                    onPress: () => setShowEmailModal(true),
                },
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
            ]
        );
    };

    const closeEmailModal = () => {
        setShowEmailModal(false);
    };

    const resendOtp = async (email: string): Promise<void> => {
        try {
            setResendingOtp(true);
            
            // ✅ NEW: Direct access to OTP resend use case
            await container.account.otp.resend.execute(email);
            
            setShowEmailModal(false);
            
            Toast.show({
                type: 'info',
                text1: 'Đã gửi mã OTP',
                text2: 'Vui lòng kiểm tra email của bạn',
            });

            navigation.navigate('OTPVerification', {
                email: email,
                userId: pendingUsername,
            });
        } catch (error: any) {
            Alert.alert('Lỗi', error.message || 'Không thể gửi mã OTP');
        } finally {
            setResendingOtp(false);
        }
    };

    return {
        showEmailModal,
        pendingUsername,
        resendingOtp,
        openEmailModal,
        closeEmailModal,
        resendOtp,
    };
};