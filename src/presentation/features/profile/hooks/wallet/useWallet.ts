import { useState, useEffect, useCallback } from 'react';
import { CreateWalletResponse } from '../../../../../data/models/wallet/CreateWalletResponse';
import { WalletBalanceResponse } from '../../../../../data/models/wallet/WalletBalanceResponse';
import sl from '../../../../../core/di/InjectionContainer';


interface UseWalletResult {
    balance: number | null;
    renterId: string | null;
    loading: boolean;
    error: string | null;
    creating: boolean;
    createError: string | null;
    refresh: () => Promise<void>;
    createWallet: () => Promise<CreateWalletResponse | null>;
}

/**
 * Custom hook for wallet operations
 * Handles fetching balance and creating wallet
 */
export const useWallet = (): UseWalletResult => {
    const [walletData, setWalletData] = useState<WalletBalanceResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const getWalletBalanceUseCase = sl.getGetWalletBalanceUseCase();
    const createWalletUseCase = sl.getCreateWalletUseCase();

    /**
     * Fetches wallet balance
     */
    const fetchBalance = useCallback(async () => {
        try {
        setLoading(true);
        setError(null);
        const data = await getWalletBalanceUseCase.execute();
        setWalletData(data);
        } catch (err: any) {
        setError(err.message || 'Failed to fetch wallet balance');
        console.error('Wallet balance error:', err);
        } finally {
        setLoading(false);
        }
    }, [getWalletBalanceUseCase]);

    /**
     * Creates a new wallet
     */
    const createWallet = useCallback(async (): Promise<CreateWalletResponse | null> => {
        try {
        setCreating(true);
        setCreateError(null);
        const data = await createWalletUseCase.execute();
        // After creating, refresh balance
        await fetchBalance();
        return data;
        } catch (err: any) {
        setCreateError(err.message || 'Failed to create wallet');
        console.error('Create wallet error:', err);
        return null;
        } finally {
        setCreating(false);
        }
    }, [createWalletUseCase, fetchBalance]);

    /**
     * Refresh wallet data
     */
    const refresh = useCallback(async () => {
        await fetchBalance();
    }, [fetchBalance]);

    // Initial fetch
    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    return {
        balance: walletData?.balance ?? null,
        renterId: walletData?.renterId ?? null,
        loading,
        error,
        creating,
        createError,
        refresh,
        createWallet,
    };
};