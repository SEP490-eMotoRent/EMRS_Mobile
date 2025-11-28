import { useState, useEffect, useCallback, useRef } from 'react';
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
    hasWallet: boolean;
    refresh: () => Promise<void>;
    createWallet: () => Promise<CreateWalletResponse | null>;
}

/**
 * Custom hook for wallet operations
 * - Fetches wallet balance on mount
 * - Auto-creates wallet if not found (only on initial fetch)
 * - Enforces single wallet per user on frontend
 * - Supports manual refresh to get updated balance
 */
export const useWallet = (): UseWalletResult => {
    const [walletData, setWalletData] = useState<WalletBalanceResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [walletExists, setWalletExists] = useState(false);

    // Refs for preventing race conditions
    const isCreatingRef = useRef(false);
    const isMountedRef = useRef(true);
    const hasInitializedRef = useRef(false);

    // Get use cases once - stable references
    const getWalletBalanceUseCase = useRef(sl.getGetWalletBalanceUseCase()).current;
    const createWalletUseCase = useRef(sl.getCreateWalletUseCase()).current;

    /**
     * Creates a new wallet
     * - Checks frontend flags to prevent duplicate creation
     * - Updates local state on success
     * - Handles "already exists" error from backend
     */
    const createWalletInternal = async (): Promise<CreateWalletResponse | null> => {
        // Frontend enforcement: prevent if wallet already exists
        if (walletExists) {
            console.log('⚠️ Wallet already exists (frontend flag), skipping creation');
            return null;
        }

        // Prevent if wallet data already present
        if (walletData !== null) {
            console.log('⚠️ Wallet data already present, skipping creation');
            setWalletExists(true);
            return null;
        }

        // Prevent concurrent creation
        if (isCreatingRef.current) {
            console.log('⚠️ Wallet creation already in progress, skipping');
            return null;
        }

        try {
            isCreatingRef.current = true;
            setCreating(true);
            setCreateError(null);
            console.log('🔨 Creating wallet...');

            const data = await createWalletUseCase.execute();
            console.log('✅ Wallet created:', data.id);

            if (isMountedRef.current) {
                setWalletExists(true);
                setWalletData({
                    balance: data.balance,
                    renterId: data.renterId,
                });
                setError(null);
                setLoading(false);
            }

            return data;
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to create wallet';
            console.error('❌ Create wallet error:', errorMsg);

            // Backend says wallet already exists - sync our state
            const alreadyExists =
                errorMsg.toLowerCase().includes('already exists') ||
                errorMsg.toLowerCase().includes('already has a wallet') ||
                errorMsg.toLowerCase().includes('already have');

            if (alreadyExists) {
                console.log('⚠️ Backend says wallet exists, fetching existing wallet...');
                if (isMountedRef.current) {
                    setWalletExists(true);
                }
                // Try to fetch the existing wallet
                try {
                    const existingWallet = await getWalletBalanceUseCase.execute();
                    if (isMountedRef.current) {
                        setWalletData(existingWallet);
                        setError(null);
                        console.log('✅ Fetched existing wallet:', existingWallet.balance);
                    }
                } catch (fetchErr) {
                    console.error('❌ Failed to fetch existing wallet:', fetchErr);
                }
                return null;
            }

            if (isMountedRef.current) {
                setCreateError(errorMsg);
            }
            return null;
        } finally {
            isCreatingRef.current = false;
            if (isMountedRef.current) {
                setCreating(false);
            }
        }
    };

    /**
     * Public createWallet wrapper
     */
    const createWallet = useCallback(async (): Promise<CreateWalletResponse | null> => {
        return createWalletInternal();
    }, [walletExists, walletData]);

    /**
     * Fetches wallet balance
     * - On initial fetch: auto-creates wallet if not found
     * - On subsequent fetches: just reports error if not found
     */
    const fetchBalance = useCallback(async (isInitialFetch: boolean = false) => {
        console.log('📡 Fetching wallet balance...', { isInitialFetch });

        try {
            setLoading(true);
            setError(null);

            const data = await getWalletBalanceUseCase.execute();

            if (isMountedRef.current) {
                setWalletData(data);
                setWalletExists(true);
                console.log('✅ Wallet balance fetched:', data.balance);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch wallet balance';
            console.error('⚠️ Wallet balance error:', errorMessage);

            const isWalletNotFound =
                errorMessage.toLowerCase().includes('wallet not found') ||
                errorMessage.toLowerCase().includes('not found for this user');

            console.log('🔍 Debug:', {
                isWalletNotFound,
                isInitialFetch,
                isCreating: isCreatingRef.current,
                walletExists,
            });

            // Auto-create only on initial fetch when wallet doesn't exist
            if (isWalletNotFound && isInitialFetch && !isCreatingRef.current && !walletExists) {
                console.log('🔄 Wallet not found, auto-creating...');
                await createWalletInternal();
                return; // createWalletInternal handles state
            }

            // For other errors or non-initial fetch, set error
            if (isMountedRef.current && !walletExists) {
                setError(errorMessage);
            }
        } finally {
            if (isMountedRef.current && !isCreatingRef.current) {
                setLoading(false);
            }
        }
    }, [getWalletBalanceUseCase, walletExists]);

    /**
     * Manual refresh - always fetches to get updated balance
     * Does NOT auto-create wallet on refresh (user must wait for initial load)
     */
    const refresh = useCallback(async () => {
        console.log('🔃 Manual refresh requested');

        try {
            setLoading(true);
            setError(null);

            const data = await getWalletBalanceUseCase.execute();

            if (isMountedRef.current) {
                setWalletData(data);
                setWalletExists(true);
                console.log('✅ Wallet balance refreshed:', data.balance);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to refresh wallet';
            console.error('⚠️ Refresh error:', errorMessage);

            // Don't auto-create on manual refresh
            // Only set error if we don't have any wallet data
            if (isMountedRef.current && walletData === null) {
                setError(errorMessage);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [getWalletBalanceUseCase, walletData]);

    // Initial fetch on mount - only once
    useEffect(() => {
        if (hasInitializedRef.current) {
            console.log('⏭️ Already initialized, skipping');
            return;
        }

        hasInitializedRef.current = true;
        isMountedRef.current = true;
        console.log('🚀 useWallet mounted, initial fetch...');
        fetchBalance(true);

        return () => {
            console.log('🧹 useWallet unmounting...');
            isMountedRef.current = false;
        };
    }, []);

    return {
        balance: walletData?.balance ?? null,
        renterId: walletData?.renterId ?? null,
        loading: loading || creating,
        error: error || createError,
        creating,
        createError,
        hasWallet: walletExists || walletData !== null,
        refresh,
        createWallet,
    };
};