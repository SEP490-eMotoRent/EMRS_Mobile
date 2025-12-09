import { useEffect, useState } from 'react';
import { Transaction } from '../../../../../domain/entities/financial/Transaction';
import { container } from '../../../../../core/di/ServiceContainer';
import { useAppSelector } from '../../../authentication/store/hooks';

export const useTransactions = () => {
    const token = useAppSelector((state) => state.auth.token);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = async () => {
        if (!token) {
            setError('No authentication token');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await container.wallet.transactions.getMy.execute();

            console.log('✅ Transactions fetched:', result.length);
            setTransactions(result);
        } catch (err: any) {
            console.error('❌ Failed to fetch transactions:', err);
            setError(err.message || 'Failed to load transactions');
            setTransactions([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [token]);

    const refresh = async () => {
        await fetchTransactions();
    };

    return {
        transactions,
        loading,
        error,
        refresh,
    };
};