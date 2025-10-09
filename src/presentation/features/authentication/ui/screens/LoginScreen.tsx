import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native';
import { BackButton } from '../../../../common/components/atoms/BackButton';
import { AuthStackParamList } from '../../../../shared/navigation/AuthNavigator';
import { LoginForm } from '../organism/LoginForm';

import { colors } from '../../../../common/theme/colors';
import { BrandTitle } from '../atoms/BrandTitle';
import { PrivacyNotice } from '../atoms/PrivacyNotice';
import { SignUpPrompt } from '../atoms/SignUpPrompt';
import { SocialAuthGroup } from '../atoms/SocialAuthGroup';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleContinue = (phoneNumber: string) => {
    console.log('Continue with phone:', phoneNumber);
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up');
  };

  const handleEmailSignUp = () => {
    console.log('Email sign up');
  };

  const handleSignUpNow = () => {
    navigation.navigate('Register');
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

          <BrandTitle subtitle="Sign in to your eMotoRent Account" />

          <LoginForm onContinue={handleContinue} />

          <SocialAuthGroup
            onGooglePress={handleGoogleSignUp}
            onEmailPress={handleEmailSignUp}
          />

          <SignUpPrompt onSignUpPress={handleSignUpNow} />

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