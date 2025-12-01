// src/presentation/features/auth/pages/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import { colors } from '../../../../common/theme/colors';
import { BackButton } from '../../../../common/components/atoms/buttons/BackButton';
import { PageTitle } from '../../../../common/components/molecules/PageTitle';
import { ChangePasswordForm } from '../organism/ChangePasswordForm';
import { BackToLogin } from '../molecules/BackToLogin';
import { useAppSelector } from '../../store/hooks';
import { unwrapResponse } from '../../../../../core/network/APIResponse';
import { AuthStackParamList } from '../../../../shared/navigation/StackParameters/types';
import sl from '../../../../../core/di/InjectionContainer';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  
  const currentUser = useAppSelector((state) => state.auth.user);

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (!currentUser?.id) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để đổi mật khẩu');
        return;
      }

      setLoading(true);

      const changePasswordUseCase = sl.getChangePasswordUseCase();
      const response = await changePasswordUseCase.execute({
        accountId: currentUser.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      // Unwrap the response - will throw if failed
      const result = unwrapResponse(response);

      Toast.show({
        type: 'success',
        text1: 'Đổi mật khẩu thành công',
        text2: 'Vui lòng đăng nhập lại',
      });
      
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Change password error:', error);
      Alert.alert('Đổi mật khẩu thất bại', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  const handleGoBack = () => {
    navigation.goBack();
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
            subtitle="Đổi mật khẩu"
          />

          <ChangePasswordForm 
            onSubmit={handleChangePassword}
            loading={loading}
          />

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