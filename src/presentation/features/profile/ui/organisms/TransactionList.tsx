import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TransactionItem } from '../molecules/TransactionItem';
import { Icon } from '../atoms/Icons/Icons';
import { Transaction } from '../temp';

interface TransactionListProps {
    transactions: Transaction[];
    onViewAll: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onViewAll }) => {
    return (
        <View style={styles.transactionList}>
        <Text style={styles.sectionTitle}>Giao Dịch Gần Đây</Text>
        {transactions.map((t, i) => (
            <TransactionItem key={i} {...t} />
        ))}
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
            <Text style={styles.viewAllText}>Xem Tất Cả Giao Dịch</Text>
            <Icon name="arrow" />
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    transactionList: {
        margin: 16,
        padding: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        gap: 6,
    },
    viewAllText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
});
