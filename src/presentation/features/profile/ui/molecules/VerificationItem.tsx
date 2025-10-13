import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusIcon } from '../atoms/Icons/StatusIcon';
import { Verification } from '../temp';

export const VerificationItem: React.FC<Verification> = ({ label, status, validUntil }) => {
    const isVerified = status === 'verified';
    const isValid = status === 'valid';
    
    const getStatusText = (): string => {
        if (isVerified) return 'Verified';
        if (isValid && validUntil) return `Valid until ${validUntil}`;
        return 'Verification needed';
    };
    
    return (
        <View style={styles.verificationItem}>
        <Text style={styles.verificationLabel}>{label}</Text>
        <View style={styles.verificationStatus}>
            <StatusIcon verified={isVerified || isValid} />
            <Text style={[
            styles.verificationStatusText,
            (isVerified || isValid) ? styles.verifiedText : styles.unverifiedText
            ]}>
            {getStatusText()}
            </Text>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    verificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    verificationLabel: {
        color: '#fff',
        fontSize: 15,
    },
    verificationStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verificationStatusText: {
        fontSize: 14,
    },
    verifiedText: {
        color: '#4ade80',
    },
    unverifiedText: {
        color: '#f87171',
    },
});