// features/authentication/ui/screens/LoginScreen.tsx
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text
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

  // TODO: REMOVE THIS WHEN API IS READY - Test navigation only
  const handleTestNavigation = () => {
    // @ts-ignore - Temporarily navigate to Home screen for testing
    navigation.navigate('Home');
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

          {/* TODO: REMOVE WHEN API IS READY - Test navigation button */}
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={handleTestNavigation}
          >
            <Text style={styles.testButtonText}>Test Navigation (Remove when needed)</Text>
          </TouchableOpacity>

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
  // TODO: REMOVE WHEN API IS READY - Test button styles
  testButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#FF5252',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});