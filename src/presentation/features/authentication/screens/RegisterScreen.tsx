import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button } from '../../../common/components/Button';
import { Input } from '../../../common/components/Input';
import { SocialButton } from '../../../common/components/SocialButton';
import { GoogleIcon } from '../../../common/components/GoogleIcon';
import { colors } from '../../../common/theme/colors';

export const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleContinue = () => {
    console.log('Register with:', { email, password, confirmPassword });
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up');
  };

  const handleSignIn = () => {
    console.log('Navigate to sign in');
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
            <Text style={styles.subtitle}>Let's Create Your eMotoRent Account</Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
          </View>

          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
          />

          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>Or</Text>
          </View>

          <SocialButton
            title="Sign Up With Google"
            onPress={handleGoogleSignUp}
            icon={<GoogleIcon />}
          />

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>
              I already Have An Account
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
    color: colors.text.secondary,
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
  signInContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  signInText: {
    color: colors.text.secondary,
    fontSize: 14,
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
