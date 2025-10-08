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
import { BackButton } from '../../../common/components/BackButton';
import { Input } from '../../../common/components/Input';
import { SocialButton } from '../../../common/components/SocialButton';
import { colors } from '../../../common/theme/colors';
import { FontAwesome5, AntDesign  } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

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

          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>
              <Text style={styles.brandEmoto}>eMoto</Text>
              <Text style={styles.brandRent}>Rent</Text>
            </Text>
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

          <SocialButton
            title="Sign Up With E-Mail"
            onPress={handleEmailSignUp}
            icon={<FontAwesome5 name="envelope" size={24} color="white" />}
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
  separatorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorText: {
    color: colors.text.secondary,
    fontSize: 16,
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
