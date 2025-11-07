import { useNavigation } from '@react-navigation/native';
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

import sl from '../../../../../../core/di/InjectionContainer';
import { RegisterUseCase } from '../../../../../../domain/usecases/account/RegisterUseCase';
import { BackButton } from '../../../../../common/components/atoms/buttons/BackButton';
import { colors } from '../../../../../common/theme/colors';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { BrandTitle } from '../../atoms/BrandTitle';
import { PrivacyNotice } from '../../atoms/PrivacyNotice';
import { GoogleAuthButton } from '../../molecules/GoogleAuthButton';
import { SignInPrompt } from '../../molecules/SignInPrompt';
import { RegisterForm } from '../../organism/register/RegisterForm';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleContinue = async (data: { 
    username: string;
    email: string; 
    password: string; 
    confirmPassword: string;
  }) => {
    // Validation
    if (data.password !== data.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    if (data.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (data.username.length < 3) {
      Alert.alert('Lỗi', 'Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    try {
      setLoading(true);

      const registerUseCase = new RegisterUseCase(sl.get('AccountRepository'));

      // Call API with only required fields (optional fields as empty strings)
      await registerUseCase.execute({
        username: data.username,
        email: data.email,
        password: data.password,
        fullname: '', // Optional - empty string
        phone: '', // Optional - empty string
        address: '', // Optional - empty string
        dateOfBirth: '', // Optional - empty string
        avatarUrl: '', // Optional - empty string
      });

      // SUCCESS: Navigate to OTP Verification Screen
      navigation.navigate('OTPVerification', {
        email: data.email,
        userId: data.username, // Can also extract from API response if needed
      });

    } catch (error: any) {
      Alert.alert('Đăng ký thất bại', error.message || 'Đã xảy ra lỗi');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const handlePrivacyPolicy = () => {
    console.log('Privacy policy');
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

          <BrandTitle subtitle="Hãy tạo tài khoản eMotoRent của bạn" />

          <RegisterForm onContinue={handleContinue} loading={loading} />

          <GoogleAuthButton onPress={handleGoogleSignUp} showSeparator={true} />

          <SignInPrompt onSignInPress={handleSignIn} />

          <PrivacyNotice onPrivacyPolicyPress={handlePrivacyPolicy} />
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