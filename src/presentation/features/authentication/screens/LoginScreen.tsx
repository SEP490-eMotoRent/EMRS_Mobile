import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Button } from '../../../common/components/Button';
import { Input } from '../../../common/components/Input';
import { SocialButton } from '../../../common/components/SocialButton';
import { GoogleIcon } from '../../../common/components/GoogleIcon';
import { EmailIcon } from '../../../common/components/EmailIcon';
import { colors } from '../../../common/theme/colors';

export const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    console.log('Continue with phone:', phoneNumber);
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up');
  };

  const handleEmailSignUp = () => {
    console.log('Email sign up');
  };

  const handleSignUpNow = () => {
    console.log('Navigate to sign up');
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
          
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>eMotoRent</Text>
            <Text style={styles.subtitle}>Sign in to your eMotoRent Account</Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
          />

          {/* Or Separator */}
          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>Or</Text>
          </View>

          <SocialButton
            title="Sign Up With Google"
            onPress={handleGoogleSignUp}
            icon={<GoogleIcon />}
          />

          <SocialButton
            title="Sign Up With E-Mail"
            onPress={handleEmailSignUp}
            icon={<EmailIcon />}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't Have An Account?{' '}
              <Text style={styles.signUpLink} onPress={handleSignUpNow}>
                Sign Up Now
              </Text>
            </Text>
          </View>

          <View style={styles.privacyContainer}>
            <Text style={styles.privacyText}>
              By Clicking Continue, you agree to our{' '}
              <Text style={styles.privacyLink} onPress={handlePrivacyPolicy}>
                Privacy Policy
              </Text>
            </Text>
          </View>
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
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  backButtonText: {
    color: colors.text.primary,
    fontSize: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  separatorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  signUpText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  signUpLink: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  privacyContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  privacyText: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: 'center',
  },
  privacyLink: {
    color: colors.text.accent,
    fontWeight: '500',
  },
});
