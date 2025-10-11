
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ClockIcon: React.FC = () => (
    <View style={styles.container}>
        <Text style={styles.icon}>🕐</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1F1F1F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 32,
    },
});