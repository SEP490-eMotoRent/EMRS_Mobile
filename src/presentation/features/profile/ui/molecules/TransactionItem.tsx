import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '../atoms/Icons/Icons';
import { Transaction } from '../temp';

export const TransactionItem: React.FC<Transaction> = ({ title, date, amount }) => {
    const isPositive = amount > 0;
    
    return (
        <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
                <Icon name={isPositive ? 'plus' : 'minus'} color={isPositive ? '#4ade80' : '#f87171'} />
            </View>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{title}</Text>
                <Text style={styles.transactionDate}>{date}</Text>
            </View>
            <Text style={[styles.transactionAmount, isPositive ? styles.positive : styles.negative]}>
                {isPositive ? '+' : ''}{amount.toLocaleString()}đ
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    transactionDate: {
        color: '#666',
        fontSize: 13,
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    positive: {
        color: '#4ade80',
    },
    negative: {
        color: '#f87171',
    },
});