import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface StatusIconProps {
    verified: boolean;
    size?: number;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ verified, size = 16 }) => {
    const iconStyle: TextStyle = {
        fontSize: size,
    };
    
    return (
        <Text style={[
        styles.statusIcon,
        iconStyle,
        verified ? styles.verified : styles.unverified
        ]}>
        {verified ? '✓' : '✗'}
        </Text>
    );
};

const styles = StyleSheet.create({
    statusIcon: {
        marginRight: 6,
    },
    verified: {
        color: '#4ade80',
    },
    unverified: {
        color: '#f87171',
    },
});