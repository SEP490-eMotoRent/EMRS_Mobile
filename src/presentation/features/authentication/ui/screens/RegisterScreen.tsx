import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { BackButton } from '../../../../common/components/atoms/BackButton';
import { colors } from '../../../../common/theme/colors';
import { AuthStackParamList } from '../../../../shared/navigation/Authentication/AuthNavigator';
import { BrandTitle } from '../atoms/BrandTitle';
import { PrivacyNotice } from '../atoms/PrivacyNotice';
import { GoogleAuthButton } from '../molecules/GoogleAuthButton';
import { SignInPrompt } from '../molecules/SignInPrompt';
import { RegisterForm } from '../organism/RegisterForm';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleContinue = (data: { email: string; password: string; confirmPassword: string }) => {
    console.log('Register with:', data);
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

          <BrandTitle subtitle="Let's Create Your eMotoRent Account" />

          <RegisterForm onContinue={handleContinue} />

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