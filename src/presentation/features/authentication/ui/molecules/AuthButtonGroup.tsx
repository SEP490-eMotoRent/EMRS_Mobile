import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppColors } from '../../../../common/constants/AppColor';
import { AuthStackParamList } from '../../../../shared/navigation/Authentication/AuthNavigator';
import { AppButton } from '../atoms/AppButton';

interface AuthButtonGroupProps {
    navigation: NativeStackNavigationProp<AuthStackParamList>;
}

export const AuthButtonGroup: React.FC<AuthButtonGroupProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
        <AppButton
            text="Đăng ký"
            onPress={() => navigation.navigate('Register')}
            color={AppColors.blue}
            accessibilityLabel="Đăng ký tài khoản mới"
        />
        <View style={styles.spacer} />
        <AppButton
            text="Đăng nhập"
            onPress={() => navigation.navigate('Login')}
            color={AppColors.darkGray}
            accessibilityLabel="Đăng nhập vào tài khoản của bạn"
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        alignItems: 'stretch',
    },
    spacer: {
        height: 16,
    },
});