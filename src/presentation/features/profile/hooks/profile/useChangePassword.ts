import { useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { container } from '../../../../../core/di/ServiceContainer';
import { useRenterProfile } from './useRenterProfile';

export const useChangePassword = (navigation: any) => {
    const [loading, setLoading] = useState(false);
    const { renter, loading: profileLoading } = useRenterProfile();

    const changePassword = async (data: {
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

            await container.account.passwords.change.execute({
                accountId: renter.account.id,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

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

    return {
        changePassword,
        loading,
        profileLoading,
    };
};