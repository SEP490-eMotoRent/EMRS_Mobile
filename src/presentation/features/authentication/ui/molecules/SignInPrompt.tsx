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
                I already Have An Account!{' '}
                <Text style={styles.link} onPress={onSignInPress}>
                    Sign In
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
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