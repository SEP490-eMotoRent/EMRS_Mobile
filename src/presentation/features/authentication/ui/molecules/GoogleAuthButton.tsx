import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SocialButton } from '../../../../common/components/atoms/SocialButton';
import { colors } from '../../../../common/theme/colors';

interface GoogleAuthButtonProps {
    onPress: () => void;
    showSeparator?: boolean;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
    onPress,
    showSeparator = true 
}) => {
    return (
        <View style={styles.container}>
            {showSeparator && (
                <View style={styles.separatorContainer}>
                    <Text style={styles.separatorText}>Or</Text>
                </View>
            )}

            <SocialButton
                title="Sign Up With Google"
                onPress={onPress}
                icon={<AntDesign name="google" size={24} color="white" />}
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
        marginVertical: 20,
    },
    separatorText: {
        color: colors.text.secondary,
        fontSize: 16,
    },
});