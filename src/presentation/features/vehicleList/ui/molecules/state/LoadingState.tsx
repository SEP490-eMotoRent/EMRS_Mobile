import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../common/theme/colors';

interface LoadingStateProps {
    message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
    message = 'Loading vehicles...'
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.button.primary} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
        minHeight: 400,
    },
    text: {
        color: colors.text.secondary,
        fontSize: 16,
        marginTop: 16,
    },
});