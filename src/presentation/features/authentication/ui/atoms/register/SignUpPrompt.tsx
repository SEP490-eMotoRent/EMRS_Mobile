import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../../common/theme/colors';

interface SignUpPromptProps {
    onSignUpPress: () => void;
}

export const SignUpPrompt: React.FC<SignUpPromptProps> = ({ onSignUpPress }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Chưa có tài khoản?{' '}
                <Text style={styles.link} onPress={onSignUpPress}>
                    Đăng ký ngay
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 16,
    },
    text: {
        color: colors.text.secondary,
        fontSize: 14,
    },
    link: {
        color: colors.text.primary,
        fontWeight: '500',
    },
});