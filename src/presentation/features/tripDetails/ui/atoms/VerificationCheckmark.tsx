import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface VerificationCheckmarkProps {
    label: string;
    verified: boolean;
}

export const VerificationCheckmark: React.FC<VerificationCheckmarkProps> = ({ label, verified }) => {
    return (
        <View style={styles.container}>
        {verified && (
            <>
            <View style={styles.iconContainer}>
                <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.label}>{label}</Text>
            </>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    checkmark: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    label: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '500',
    },
});