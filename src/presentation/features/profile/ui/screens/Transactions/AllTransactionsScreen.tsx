import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { BackButton } from '../../../../../common/components';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { useTransactions } from '../../../hooks/transactions/useTransactions';
import { TransactionItem } from '../../molecules/TransactionItem';
import { TransactionTypeHelper } from '../../../../../../domain/helpers/TransactionTypeHelper';

type AllTransactionsScreenNavigationProp = StackNavigationProp<
    ProfileStackParamList,
    'AllTransactions'
>;

interface AllTransactionsScreenProps {
    navigation: AllTransactionsScreenNavigationProp;
}

export const AllTransactionsScreen: React.FC<AllTransactionsScreenProps> = ({ navigation }) => {
    const { 
        transactions: transactionEntities, 
        loading, 
        error,
        refresh
    } = useTransactions();

    // Map transactions to UI format
    const transactions = transactionEntities.map(t => ({
        id: t.id, // Use actual transaction ID
        title: TransactionTypeHelper.toVietnamese(t.transactionType),
        date: new Date(t.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }),
        // Apply negative sign for debits (money OUT)
        amount: TransactionTypeHelper.isCredit(t.transactionType) ? t.amount : -t.amount,
    }));

    const handleRefresh = async () => {
        await refresh();
    };

    if (loading && transactions.length === 0) {
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

    if (error && transactions.length === 0) {
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Tất Cả Giao Dịch</Text>
                <View style={{ width: 40 }} />
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
                        <Text style={styles.emptyText}>Không có giao dịch nào</Text>
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