import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VerificationItem } from '../molecules/VerificationItem';
import { Verification } from '../temp';
import { Icon } from '../atoms/Icons/Icons';

type IncomingVerification = {
    title: string;
    status: 'verified' | 'valid' | 'needed' | 'expired';
    icon: string;
};

interface VerificationCardProps {
    verifications: IncomingVerification[];
    onVerify: () => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ 
    verifications, 
    onVerify
}) => {
    // Filter out phone verification - we only check "not null" so it's pointless
    const filteredVerifications = verifications.filter(
        v => !v.title.toLowerCase().includes('phone') &&
            !v.title.toLowerCase().includes('điện thoại') &&
            !v.title.toLowerCase().includes('số điện thoại')
    );

    // Convert 'expired' → 'needed' to satisfy VerificationItem
    const safeVerifications: Verification[] = filteredVerifications.map(v => ({
        label: v.title,
        status: v.status === 'expired' ? 'needed' : v.status,
        validUntil: v.status === 'valid' ? '31 Thg 12, 2025' : undefined,
    }));

    const allVerified = filteredVerifications.every(
        v => v.status === 'verified' || v.status === 'valid'
    );

    return (
        <View style={styles.verificationCard}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Xác Thực Tài Khoản</Text>
            </View>

            {safeVerifications.map((v, i) => (
                <VerificationItem key={i} {...v} />
            ))}

            {!allVerified && (
                <View style={styles.verificationWarning}>
                    <Icon name="warning" size={18} color="#FBBF24" />
                    <Text style={styles.warningText}>
                        Chưa xác thực hoàn toàn. Vui lòng hoàn tất xác thực để sử dụng đầy đủ tính năng.
                    </Text>
                </View>
            )}

            <TouchableOpacity style={styles.verificationButton} onPress={onVerify}>
                <Text style={styles.verificationButtonText}>Quản Lý Xác Thực</Text>
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
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    verificationWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7f1d1d',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
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