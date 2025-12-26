import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '../atoms/Icons/Icons';
import { Transaction } from '../temp';

export const TransactionItem: React.FC<Transaction> = ({ title, date, amount, status }) => {
    const isPositive = amount > 0;
    const isPending = status === 'Pending';
    const isFailed = status === 'Failed';
    
    return (
        <View style={[styles.transactionItem, isFailed && styles.failedItem]}>
            <View style={[styles.transactionIcon, isFailed && styles.failedIcon]}>
                <Icon 
                    name={isFailed ? 'close' : (isPositive ? 'plus' : 'minus')} 
                    color={
                        isFailed ? '#ef4444' : 
                        isPending ? '#fbbf24' : 
                        (isPositive ? '#4ade80' : '#f87171')
                    } 
                />
            </View>
            <View style={styles.transactionInfo}>
                <View style={styles.titleRow}>
                    <Text style={[styles.transactionTitle, isFailed && styles.failedText]}>
                        {title}
                    </Text>
                    {isPending && (
                        <View style={styles.pendingBadge}>
                            <Text style={styles.pendingText}>Đang xử lý</Text>
                        </View>
                    )}
                    {isFailed && (
                        <View style={styles.failedBadge}>
                            <Text style={styles.failedBadgeText}>Thất bại</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.transactionDate, isFailed && styles.failedText]}>
                    {date}
                </Text>
            </View>
            <Text style={[
                styles.transactionAmount,
                isFailed ? styles.failed : 
                isPending ? styles.pending : 
                (isPositive ? styles.positive : styles.negative)
            ]}>
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
    failedItem: {
        opacity: 0.6, // ✅ Dim failed transactions
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
    failedIcon: {
        backgroundColor: '#2a1a1a', // ✅ Darker background for failed
    },
    transactionInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    transactionTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    failedText: {
        color: '#999', // ✅ Gray out failed text
    },
    pendingBadge: {
        backgroundColor: '#fbbf24',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    pendingText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '600',
    },
    failedBadge: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    failedBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
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
    pending: {
        color: '#fbbf24',
    },
    failed: {
        color: '#ef4444',
        textDecorationLine: 'line-through',
    },
});