import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppColors } from '../../../../common/constants/AppColor';
import { AuthStackParamList } from '../../../../shared/navigation/AuthNavigator';
import { AppButton } from '../atoms/AppButton';

interface AuthButtonGroupProps {
    navigation: NativeStackNavigationProp<AuthStackParamList>;
}

export const AuthButtonGroup: React.FC<AuthButtonGroupProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
        <AppButton
            text="Sign Up"
            onPress={() => navigation.navigate('Register')}
            color={AppColors.blue}
            accessibilityLabel="Sign up to create a new account"
        />
        <View style={styles.spacer} />
        <AppButton
            text="Sign In"
            onPress={() => navigation.navigate('Login')}
            color={AppColors.darkGray}
            accessibilityLabel="Sign in to your account"
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