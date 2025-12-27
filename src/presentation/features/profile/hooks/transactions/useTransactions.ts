import { useEffect, useState } from 'react';
import { Transaction } from '../../../../../domain/entities/financial/Transaction';
import { container } from '../../../../../core/di/ServiceContainer';
import { useAppSelector } from '../../../authentication/store/hooks';

interface UseTransactionsOptions {
    includeFailedTransactions?: boolean;
}

export const useTransactions = (options: UseTransactionsOptions = {}) => {
    const { includeFailedTransactions = false } = options;
    
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

            // FIXED: Include 'Completed' status (for insurance transactions)
            const validTransactions = includeFailedTransactions 
                ? result
                : result.filter(t => 
                    t.status === 'Success' || 
                    t.status === 'Pending' ||
                    t.status === 'Completed'  // INSURANCE TRANSACTIONS
                );
            
            // Sort by date (newest first)
            validTransactions.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            
            setTransactions(validTransactions);
        } catch (err: any) {
            console.error('❌ Failed to fetch transactions:', err);
            setError(err.message || 'Failed to load transactions');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [token, includeFailedTransactions]);

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