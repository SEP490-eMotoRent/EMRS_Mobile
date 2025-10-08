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
import { BackButton } from '../../../common/components/BackButton';
import { Input } from '../../../common/components/Input';
import { SocialButton } from '../../../common/components/SocialButton';
import { colors } from '../../../common/theme/colors';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const handleContinue = () => {
    console.log('Register with:', { email, password, confirmPassword });
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

          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>
              <Text style={styles.brandEmoto}>eMoto</Text>
              <Text style={styles.brandRent}>Rent</Text>
            </Text>
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
            style={styles.continueButton}
            textStyle={styles.continueButtonText}
          />

          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>Or</Text>
          </View>

          <SocialButton
            title="Sign Up With Google"
            onPress={handleGoogleSignUp}
            icon={<AntDesign name="google" size={24} color="white" />}
          />
          
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>
            I already Have An Account!{' '}
              <Text style={styles.signInLink} onPress={handleSignIn}>
                Sign In
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
  
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  brandEmoto: {
    color: '#C9B6FF',
  },
  brandRent: {
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 24,
    color: colors.text.secondary,
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#4285F4',
    borderWidth: 0,
    height: 56,
    borderRadius: 28,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  signInLink: {
    color: colors.text.primary,
    fontWeight: '500',
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
