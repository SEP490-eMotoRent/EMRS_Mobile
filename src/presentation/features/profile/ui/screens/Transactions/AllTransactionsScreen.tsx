import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionTypeHelper } from '../../../../../../domain/helpers/TransactionTypeHelper';
import { BackButton } from '../../../../../common/components';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { useTransactions } from '../../../hooks/transactions/useTransactions';
import { TransactionItem } from '../../molecules/TransactionItem';

type AllTransactionsScreenNavigationProp = StackNavigationProp<
    ProfileStackParamList,
    'AllTransactions'
>;

interface AllTransactionsScreenProps {
    navigation: AllTransactionsScreenNavigationProp;
}

type FilterType = 'All' | 'Success' | 'Pending' | 'Failed';

export const AllTransactionsScreen: React.FC<AllTransactionsScreenProps> = ({ navigation }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    
    const { 
        transactions: transactionEntities, 
        loading, 
        error,
        refresh
    } = useTransactions({ includeFailedTransactions: true });

    // Map transactions to UI format
    const allTransactions = transactionEntities.map(t => ({
        id: t.id,
        title: TransactionTypeHelper.toVietnamese(t.transactionType),
        date: new Date(t.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        amount: TransactionTypeHelper.isCredit(t.transactionType) ? t.amount : -t.amount,
        status: t.status as 'Success' | 'Pending' | 'Failed',
    }));

    // ✅ Apply filter
    const transactions = activeFilter === 'All' 
        ? allTransactions 
        : allTransactions.filter(t => t.status === activeFilter);

    const handleRefresh = async () => {
        await refresh();
    };

    if (loading && allTransactions.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <BackButton onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Tất Cả Giao Dịch</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            </SafeAreaView>
        );
    }

    if (error && allTransactions.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <BackButton onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Tất Cả Giao Dịch</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>Lỗi: {error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // ✅ Count transactions by status
    const successCount = allTransactions.filter(t => t.status === 'Success').length;
    const pendingCount = allTransactions.filter(t => t.status === 'Pending').length;
    const failedCount = allTransactions.filter(t => t.status === 'Failed').length;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Tất Cả Giao Dịch</Text>
                <View style={{ width: 40 }} />
            </View>
            
            {/* ✅ Transaction summary */}
            {allTransactions.length > 0 && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>
                        Tổng: <Text style={styles.summaryCount}>{allTransactions.length}</Text>
                        {successCount > 0 && (
                            <Text style={styles.successSummary}> • Thành công: {successCount}</Text>
                        )}
                        {pendingCount > 0 && (
                            <Text style={styles.pendingSummary}> • Đang xử lý: {pendingCount}</Text>
                        )}
                        {failedCount > 0 && (
                            <Text style={styles.failedSummary}> • Thất bại: {failedCount}</Text>
                        )}
                    </Text>
                </View>
            )}

            {/* ✅ Filter Chips */}
            <View style={styles.filterContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContent}
                >
                    <FilterChip
                        label="Tất Cả"
                        count={allTransactions.length}
                        active={activeFilter === 'All'}
                        onPress={() => setActiveFilter('All')}
                    />
                    {successCount > 0 && (
                        <FilterChip
                            label="Thành Công"
                            count={successCount}
                            active={activeFilter === 'Success'}
                            onPress={() => setActiveFilter('Success')}
                            color="#4ade80"
                        />
                    )}
                    {pendingCount > 0 && (
                        <FilterChip
                            label="Đang Xử Lý"
                            count={pendingCount}
                            active={activeFilter === 'Pending'}
                            onPress={() => setActiveFilter('Pending')}
                            color="#fbbf24"
                        />
                    )}
                    {failedCount > 0 && (
                        <FilterChip
                            label="Thất Bại"
                            count={failedCount}
                            active={activeFilter === 'Failed'}
                            onPress={() => setActiveFilter('Failed')}
                            color="#ef4444"
                        />
                    )}
                </ScrollView>
            </View>
            
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                        tintColor="#00ff00"
                        colors={["#00ff00"]}
                    />
                }
            >
                <View style={styles.transactionList}>
                    {transactions.length === 0 ? (
                        <Text style={styles.emptyText}>
                            {activeFilter === 'All' 
                                ? 'Không có giao dịch nào' 
                                : `Không có giao dịch ${activeFilter === 'Success' ? 'thành công' : activeFilter === 'Pending' ? 'đang xử lý' : 'thất bại'}`}
                        </Text>
                    ) : (
                        transactions.map((t) => (
                            <TransactionItem key={t.id} {...t} />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// ✅ Filter Chip Component
interface FilterChipProps {
    label: string;
    count: number;
    active: boolean;
    onPress: () => void;
    color?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, count, active, onPress, color = '#fff' }) => {
    return (
        <TouchableOpacity
            style={[
                styles.filterChip,
                active && styles.filterChipActive,
                active && { borderColor: color }
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.filterChipText,
                active && styles.filterChipTextActive,
                active && { color: color }
            ]}>
                {label} ({count})
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    summaryContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#0a0a0a',
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    summaryText: {
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
    },
    summaryCount: {
        color: '#fff',
        fontWeight: '600',
    },
    successSummary: {
        color: '#4ade80',
        fontWeight: '500',
    },
    pendingSummary: {
        color: '#fbbf24',
        fontWeight: '500',
    },
    failedSummary: {
        color: '#ef4444',
        fontWeight: '500',
    },
    filterContainer: {
        backgroundColor: '#0a0a0a',
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
        paddingVertical: 12,
    },
    filterContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        borderWidth: 1.5,
        borderColor: '#333',
    },
    filterChipActive: {
        backgroundColor: '#222',
        borderWidth: 1.5,
    },
    filterChipText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    filterChipTextActive: {
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    transactionList: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 20,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff0000',
        fontSize: 16,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 32,
    },
});