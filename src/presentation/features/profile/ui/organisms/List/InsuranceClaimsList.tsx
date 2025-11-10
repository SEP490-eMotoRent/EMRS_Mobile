import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { InsuranceClaimResponse } from '../../../../../../data/models/insurance/insuranceClaim/InsuranceClaimResponse';
import { InsuranceClaimCard } from '../../molecules/InsuranceClaimCard';

interface InsuranceClaimsListProps {
    claims: InsuranceClaimResponse[];
    onClaimPress: (claimId: string) => void;
}

export const InsuranceClaimsList: React.FC<InsuranceClaimsListProps> = ({ 
    claims, 
    onClaimPress 
}) => {
    if (claims.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🛡️</Text>
                <Text style={styles.emptyTitle}>Chưa Có Yêu Cầu Bảo Hiểm</Text>
                <Text style={styles.emptyText}>
                    Bạn chưa có yêu cầu bảo hiểm nào. {'\n'}
                    Khi có sự cố, hãy báo cáo ngay để được hỗ trợ.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={claims}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <InsuranceClaimCard 
                    claim={item} 
                    onPress={() => onClaimPress(item.id)} 
                />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});