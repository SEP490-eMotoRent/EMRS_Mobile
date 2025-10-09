import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextLink } from '../../../../common/components/atoms/TextLink';

interface BackToLoginProps {
    onPress: () => void;
}

export const BackToLogin: React.FC<BackToLoginProps> = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <TextLink text="Back to Login" onPress={onPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
});