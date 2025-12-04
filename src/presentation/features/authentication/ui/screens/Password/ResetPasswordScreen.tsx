import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import { colors } from '../../../../../common/theme/colors';
import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { PageTitle } from '../../../../../common/components/molecules/PageTitle';
import { ResetPasswordForm } from '../../organism/password/ResetPasswordForm';
import { BackToLogin } from '../../molecules/BackToLogin';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import sl from '../../../../../../core/di/InjectionContainer';

type ResetPasswordScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'ResetPassword'
>;

type ResetPasswordScreenRouteProp = RouteProp<
    AuthStackParamList,
    'ResetPassword'
>;

export const ResetPasswordScreen: React.FC = () => {
    const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
    const route = useRoute<ResetPasswordScreenRouteProp>();
    const { email } = route.params;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (data: {
        otpCode: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        try {
        setLoading(true);
        setError('');

        const resetPasswordUseCase = sl.getResetPasswordUseCase();
        const response = await resetPasswordUseCase.execute(
            email,
            data.otpCode,
            data.newPassword,
            data.confirmPassword
        );

        if (response.success) {
            Toast.show({
            type: 'success',
            text1: 'Đặt lại mật khẩu thành công',
            text2: 'Vui lòng đăng nhập lại',
            });

            // Navigate back to Login
            navigation.navigate('Login');
        } else {
            setError(response.message || 'Không thể đặt lại mật khẩu');
        }
        } catch (err: any) {
        console.error('Reset password error:', err);
        setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
        setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigation.navigate('Login');
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}>
            <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            <BackButton onPress={handleGoBack} />

            <PageTitle 
                title="Đặt lại mật khẩu" 
                subtitle="Nhập mã OTP và mật khẩu mới"
            />

            <ResetPasswordForm 
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                onErrorDismiss={() => setError('')}
            />

            <BackToLogin onPress={handleBackToLogin} />
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