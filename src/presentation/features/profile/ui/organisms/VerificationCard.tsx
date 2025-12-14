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

    // ✅ FIX: Treat all uploaded documents as "verified" (only check existence)
    const safeVerifications: Verification[] = filteredVerifications.map(v => ({
        label: v.title,
        // If it's not 'needed', it means document exists → treat as 'verified'
        status: v.status === 'needed' ? 'needed' : 'verified',
        // status: v.status === 'expired' ? 'needed' : v.status, // ⬅️ COMMENTED OUT: Old logic
        validUntil: undefined, // Don't show validity period
    }));

    // ✅ Check if all documents exist (not just verified by admin)
    const allVerified = filteredVerifications.every(
        v => v.status !== 'needed' // Only check if uploaded, ignore pending/verified distinction
        // v => v.status === 'verified' || v.status === 'valid' // ⬅️ COMMENTED OUT: Old logic
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
                        Vui lòng tải lên giấy tờ để sử dụng đầy đủ tính năng.
                        {/* Chưa xác thực hoàn toàn. Vui lòng hoàn tất xác thực để sử dụng đầy đủ tính năng. */}
                        {/* ⬆️ COMMENTED OUT: Old warning about verification */}
                    </Text>
                </View>
            )}

            <TouchableOpacity style={styles.verificationButton} onPress={onVerify}>
                <Text style={styles.verificationButtonText}>Quản Lý Giấy Tờ</Text>
                {/* Quản Lý Xác Thực */}
                {/* ⬆️ COMMENTED OUT: Old button text */}
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