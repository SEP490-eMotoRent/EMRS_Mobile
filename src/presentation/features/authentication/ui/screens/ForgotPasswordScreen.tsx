import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { colors } from '../../../../common/theme/colors';
import { BackButton } from '../../../../common/components/atoms/buttons/BackButton';
import { PageTitle } from '../../../../common/components/molecules/PageTitle';
import { ResetPasswordForm } from '../organism/ResetPasswordForm';
import { BackToLogin } from '../molecules/BackToLogin';

export const ForgotPasswordScreen: React.FC = () => {
  const handleResetPassword = (email: string) => {
    console.log('Reset password for:', email);
  };

  const handleBackToLogin = () => {
    console.log('Navigate back to login');
  };

  const handleGoBack = () => {
    console.log('Go back');
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
            title="eMotoRent" 
            subtitle="Đặt lại mật khẩu"
          />

          <ResetPasswordForm onSubmit={handleResetPassword} />

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