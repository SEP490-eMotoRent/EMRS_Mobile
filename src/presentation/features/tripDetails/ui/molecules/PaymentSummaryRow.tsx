import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PaymentSummaryRowProps {
    label: string;
    amount: string;
    badge?: string;
    isTotal?: boolean;
    icon?: React.ReactNode;
}

export const PaymentSummaryRow: React.FC<PaymentSummaryRowProps> = ({ 
    label, 
    amount, 
    badge,
    isTotal = false,
    icon 
    }) => {
    return (
        <View style={[styles.container, isTotal && styles.totalContainer]}>
        <View style={styles.labelContainer}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={[styles.label, isTotal && styles.totalLabel]}>{label}</Text>
            {badge && (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
            </View>
            )}
        </View>
        <Text style={[styles.amount, isTotal && styles.totalAmount]}>{amount}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    totalContainer: {
        borderTopWidth: 1,
        borderTopColor: '#2C2C2C',
        marginTop: 8,
        paddingTop: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        width: 20,
        height: 20,
    },
    label: {
        color: '#9E9E9E',
        fontSize: 14,
    },
    totalLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    badge: {
        backgroundColor: '#BB86FC',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '600',
    },
    amount: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
    },
});