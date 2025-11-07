import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { VerificationCheckmark } from '../atoms/VerificationCheckmark';
import { BookingInfoRow } from '../molecules/BookingInfoRow';
import { KeyTermItem } from '../molecules/KeyTermItem';

interface ContractInformationCardProps {
    digitalSignatureCompleted: boolean;
    signedOn: string;
    otpVerified: boolean;
    keyTerms: string[];
    onViewFullContract: () => void;
}

export const ContractInformationCard: React.FC<ContractInformationCardProps> = ({
    digitalSignatureCompleted,
    signedOn,
    otpVerified,
    keyTerms,
    onViewFullContract,
}) => {
    return (
        <View style={styles.container}>
        <SectionTitle title="Contract Information" />
        <View style={styles.card}>
            <BookingInfoRow 
            label="Kí Điện Tử" 
            value={
                <VerificationCheckmark 
                label="Hoàn Tất" 
                verified={digitalSignatureCompleted} 
                />
            } 
            />
            <BookingInfoRow label="Kí tại" value={signedOn} />
            <BookingInfoRow 
            label="Kiểm Tra OTP" 
            value={
                <VerificationCheckmark 
                label="Đã Xác Minh" 
                verified={otpVerified} 
                />
            } 
            />
            
            <View style={styles.termsContainer}>
            <Text style={styles.termsTitle}>Tóm Tắt Điều Khoản</Text>
            {keyTerms.map((term, index) => (
                <KeyTermItem key={index} text={term} />
            ))}
            </View>

            {/* Random code display */}
            <View style={styles.codeContainer}>
            {[3, 2, 7, 1, 9, 4].map((num, index) => (
                <View key={index} style={styles.codeBox}>
                <Text style={styles.codeText}>{num}</Text>
                </View>
            ))}
            </View>

            <TouchableOpacity style={styles.contractButton} onPress={onViewFullContract}>
            <Text style={styles.contractButtonText}>📄 Xem Đầy Đủ Hợp Đồng</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
    },
    termsContainer: {
        marginTop: 16,
        marginBottom: 16,
    },
    termsTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 16,
    },
    codeBox: {
        width: 40,
        height: 48,
        backgroundColor: '#2C3E50',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
    },
    contractButton: {
        backgroundColor: '#BB86FC',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    contractButtonText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '600',
    },
});