import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    View,
    ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import sl from '../../../../../core/di/InjectionContainer';
import { unwrapResponse } from '../../../../../core/network/APIResponse';
import { BackButton, PageTitle } from '../../../../common/components';
import { colors } from '../../../../common/theme/colors';
import { ChangePasswordForm } from '../../../authentication/ui/organism/ChangePasswordForm';
import { useRenterProfile } from '../../hooks/profile/useRenterProfile';


export const ChangePasswordScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const { renter, loading: profileLoading } = useRenterProfile();

    const handleChangePassword = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        try {
        if (!renter?.account?.id) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin tài khoản');
            return;
        }

        setLoading(true);

        const changePasswordUseCase = sl.getChangePasswordUseCase();
        const response = await changePasswordUseCase.execute({
            accountId: renter.account.id,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        });

        unwrapResponse(response);

        Toast.show({
            type: 'success',
            text1: 'Đổi mật khẩu thành công',
            text2: 'Mật khẩu của bạn đã được cập nhật',
        });
        
        navigation.goBack();
        } catch (error: any) {
        console.error('Change password error:', error);
        Alert.alert('Đổi mật khẩu thất bại', error.message);
        } finally {
        setLoading(false);
        }
    };

    if (profileLoading) {
        return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.button.primary} />
        </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}>
            <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            <BackButton onPress={() => navigation.goBack()} />

            <PageTitle 
                title="Đổi mật khẩu" 
                subtitle="Cập nhật mật khẩu của bạn"
            />

            <ChangePasswordForm 
                onSubmit={handleChangePassword}
                loading={loading}
            />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});