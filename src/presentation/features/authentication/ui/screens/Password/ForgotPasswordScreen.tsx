import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import { colors } from '../../../../../common/theme/colors';
import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { PageTitle } from '../../../../../common/components/molecules/PageTitle';
import { ForgotPasswordForm } from '../../organism/password/ForgotPasswordForm';
import { BackToLogin } from '../../molecules/BackToLogin';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import sl from '../../../../../../core/di/InjectionContainer';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

// ← ADD: Detection keywords for unverified email
const UNVERIFIED_EMAIL_KEYWORDS = [
  'verify your email',
  'email first',
  'verification code',
  'not verified',
  'chưa xác minh',
  'xác minh email',
];

const isUnverifiedEmailError = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return UNVERIFIED_EMAIL_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email: string) => {
    try {
      setLoading(true);
      setError('');

      const forgotPasswordUseCase = sl.getForgotPasswordUseCase();
      const response = await forgotPasswordUseCase.execute(email);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Đã gửi mã OTP',
          text2: 'Vui lòng kiểm tra email của bạn',
        });

        navigation.navigate('ResetPassword', { email });
      } else {
        // ← CHECK: Is this an unverified email error?
        if (isUnverifiedEmailError(response.message)) {
          Alert.alert(
            'Email chưa xác minh',
            'Bạn cần xác minh email trước khi đặt lại mật khẩu. Bạn có muốn xác minh ngay không?',
            [
              {
                text: 'Xác minh ngay',
                onPress: async () => {
                  try {
                    // Resend OTP to this email
                    const resendOtpUseCase = sl.getResendOtpUseCase();
                    await resendOtpUseCase.execute(email);
                    
                    Toast.show({
                      type: 'info',
                      text1: 'Đã gửi mã OTP xác minh',
                      text2: 'Vui lòng kiểm tra email của bạn',
                    });

                    // Navigate to OTP verification
                    navigation.navigate('OTPVerification', {
                      email: email,
                      userId: email, // or use username if you have it
                    });
                  } catch (err: any) {
                    Alert.alert('Lỗi', err.message || 'Không thể gửi mã OTP');
                  }
                },
              },
              {
                text: 'Hủy',
                style: 'cancel',
              },
            ]
          );
        } else {
          setError(response.message || 'Không thể gửi mã OTP');
        }
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      
      // ← ALSO CHECK: Catch block for unverified email
      if (err.message && isUnverifiedEmailError(err.message)) {
        Alert.alert(
          'Email chưa xác minh',
          'Bạn cần xác minh email trước khi đặt lại mật khẩu. Bạn có muốn xác minh ngay không?',
          [
            {
              text: 'Xác minh ngay',
              onPress: async () => {
                try {
                  const resendOtpUseCase = sl.getResendOtpUseCase();
                  await resendOtpUseCase.execute(email);
                  
                  Toast.show({
                    type: 'info',
                    text1: 'Đã gửi mã OTP xác minh',
                    text2: 'Vui lòng kiểm tra email của bạn',
                  });

                  navigation.navigate('OTPVerification', {
                    email: email,
                    userId: email,
                  });
                } catch (resendErr: any) {
                  Alert.alert('Lỗi', resendErr.message || 'Không thể gửi mã OTP');
                }
              },
            },
            {
              text: 'Hủy',
              style: 'cancel',
            },
          ]
        );
      } else {
        setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
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
            title="Quên mật khẩu" 
            subtitle="Đặt lại mật khẩu của bạn"
          />

          <ForgotPasswordForm 
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