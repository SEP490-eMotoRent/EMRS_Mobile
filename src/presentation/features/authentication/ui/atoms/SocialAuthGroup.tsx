import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SocialButton } from '../../../../common/components/atoms/SocialButton';
import { colors } from '../../../../common/theme/colors';

interface SocialAuthGroupProps {
    onGooglePress: () => void;
    onEmailPress: () => void;
}

export const SocialAuthGroup: React.FC<SocialAuthGroupProps> = ({
    onGooglePress,
    onEmailPress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.separatorContainer}>
                <Text style={styles.separatorText}>Or</Text>
            </View>

            <SocialButton
                title="Sign Up With Google"
                onPress={onGooglePress}
                icon={<AntDesign name="google" size={24} color="white" />}
            />

            <SocialButton
                title="Sign Up With E-Mail"
                onPress={onEmailPress}
                icon={<FontAwesome5 name="envelope" size={24} color="white" />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    separatorContainer: {
        alignItems: 'center',
        marginVertical: 32,
    },
    separatorText: {
        color: colors.text.secondary,
        fontSize: 16,
    },
});