import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VerificationItem } from '../molecules/VerificationItem';
import { Verification } from '../temp'; // ← This is the strict one

// Incoming from helper: includes 'expired'
type IncomingVerification = {
    title: string;
    status: 'verified' | 'valid' | 'needed' | 'expired';
    icon: string;
};

interface VerificationCardProps {
    verifications: IncomingVerification[];
    onVerify: () => void;
    onViewDetails: () => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ 
    verifications, 
    onVerify, 
    onViewDetails 
}) => {
    // Convert 'expired' → 'needed' to satisfy VerificationItem
    const safeVerifications: Verification[] = verifications.map(v => ({
        label: v.title,
        status: v.status === 'expired' ? 'needed' : v.status, // ← CRITICAL
        validUntil: v.status === 'valid' ? 'Dec 31, 2025' : undefined, // optional
    }));

    const allVerified = verifications.every(
        v => v.status === 'verified' || v.status === 'valid'
    );

    return (
        <View style={styles.verificationCard}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Account Verification</Text>
                <TouchableOpacity onPress={onViewDetails}>
                    <Text style={styles.viewDetails}>View Details</Text>
                </TouchableOpacity>
            </View>

            {safeVerifications.map((v, i) => (
                <VerificationItem key={i} {...v} />
            ))}

            {!allVerified && (
                <View style={styles.verificationWarning}>
                    <Text style={styles.warningIcon}>Warning</Text>
                    <Text style={styles.warningText}>
                        Verification incomplete. Cannot rent until all verifications are complete.
                    </Text>
                </View>
            )}

            <TouchableOpacity style={styles.verificationButton} onPress={onVerify}>
                <Text style={styles.verificationButtonText}>Verification</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    verificationCard: {
        margin: 16,
        padding: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    viewDetails: {
        color: '#999',
        fontSize: 14,
    },
    verificationWarning: {
        flexDirection: 'row',
        backgroundColor: '#7f1d1d',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    warningIcon: {
        color: '#fca5a5',
        fontSize: 16,
    },
    warningText: {
        color: '#fca5a5',
        fontSize: 13,
        flex: 1,
    },
    verificationButton: {
        backgroundColor: '#c4b5fd',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    verificationButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});