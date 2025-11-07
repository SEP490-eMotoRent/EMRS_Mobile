import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../common/theme/colors';

interface SignInPromptProps {
    onSignInPress: () => void;
}

export const SignInPrompt: React.FC<SignInPromptProps> = ({ onSignInPress }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Tôi đã có tài khoản!{' '}
                <Text style={styles.link} onPress={onSignInPress}>
                    Đăng nhập
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 48,
        marginBottom: 10,
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