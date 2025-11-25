import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SocialButton } from '../../../../common/components/atoms/SocialButton';
import { colors } from '../../../../common/theme/colors';

interface SocialAuthGroupProps {
    onGooglePress: () => void;
}

export const SocialAuthGroup: React.FC<SocialAuthGroupProps> = ({
    onGooglePress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.separatorContainer}>
                <Text style={styles.separatorText}>Hoặc</Text>
            </View>

            <SocialButton
                title="Đăng nhập với Google"
                onPress={onGooglePress}
                icon={<AntDesign name="google" size={24} color="white" />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 28,
    },
    separatorContainer: {
        alignItems: 'center',
        marginVertical: 24,
    },
    separatorText: {
        color: colors.text.secondary,
        fontSize: 16,
    },
});