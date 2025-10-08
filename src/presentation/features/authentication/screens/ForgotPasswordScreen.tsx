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
import { colors } from '../../../common/theme/colors';

export const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    console.log('Reset password for:', email);
  };

  const handleBackToLogin = () => {
    console.log('Navigate back to login');
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
            <Text style={styles.subtitle}>Reset Your Password</Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <Button
            title="Reset Password"
            onPress={handleResetPassword}
            variant="primary"
          />

          <View style={styles.backToLoginContainer}>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.backToLoginText}>
                Back to Login
              </Text>
            </TouchableOpacity>
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
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backToLoginText: {
    color: colors.text.accent,
    fontSize: 14,
    fontWeight: '500',
  },
});
