import { useState, useEffect, useCallback, useRef } from 'react';
import { CreateWalletResponse } from '../../../../../data/models/wallet/CreateWalletResponse';
import { WalletBalanceResponse } from '../../../../../data/models/wallet/WalletBalanceResponse';
import { container } from '../../../../../core/di/ServiceContainer';

interface UseWalletResult {
    balance: number | null;
    availableBalance: number | null;
    reservedBalance: number;
    renterId: string | null;
    loading: boolean;
    error: string | null;
    creating: boolean;
    createError: string | null;
    hasWallet: boolean;
    pendingWithdrawalsCount: number;
    refresh: () => Promise<void>;
    createWallet: () => Promise<CreateWalletResponse | null>;
}

/**
 * Custom hook for wallet operations with reserved balance tracking
 * - Fetches wallet balance on mount
 * - Auto-creates wallet if not found (only on initial fetch)
 * - Calculates reserved balance from pending withdrawal requests
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
    const [reservedBalance, setReservedBalance] = useState<number>(0);
    const [pendingWithdrawalsCount, setPendingWithdrawalsCount] = useState<number>(0);

    // Refs for preventing race conditions
    const isCreatingRef = useRef(false);
    const isMountedRef = useRef(true);
    const hasInitializedRef = useRef(false);

    /**
     * Calculates reserved balance from pending withdrawal requests
     */
    const calculateReservedBalance = useCallback(async () => {
        try {
            const requests = await container.wallet.withdrawal.getMy.execute();
            const pendingRequests = requests.filter(req => req.isPending());
            const reserved = pendingRequests.reduce((sum, req) => sum + req.amount, 0);
            
            if (isMountedRef.current) {
                setReservedBalance(reserved);
                setPendingWithdrawalsCount(pendingRequests.length);
            }
            
            return reserved;
        } catch (err) {
            // If withdrawal requests fail, assume 0 reserved (fail-safe)
            console.warn('Failed to fetch withdrawal requests, assuming 0 reserved:', err);
            if (isMountedRef.current) {
                setReservedBalance(0);
                setPendingWithdrawalsCount(0);
            }
            return 0;
        }
    }, []);

    /**
     * Creates a new wallet
     * - Checks frontend flags to prevent duplicate creation
     * - Updates local state on success
     * - Handles "already exists" error from backend
     */
    const createWalletInternal = async (): Promise<CreateWalletResponse | null> => {
        // Frontend enforcement: prevent if wallet already exists
        if (walletExists) {
            return null;
        }

        // Prevent if wallet data already present
        if (walletData !== null) {
            setWalletExists(true);
            return null;
        }

        // Prevent concurrent creation
        if (isCreatingRef.current) {
            return null;
        }

        try {
            isCreatingRef.current = true;
            setCreating(true);
            setCreateError(null);

            const data = await container.wallet.balance.create.execute();

            if (isMountedRef.current) {
                setWalletExists(true);
                setWalletData({
                    balance: data.balance,
                    renterId: data.renterId,
                });
                setError(null);
                setLoading(false);
                // Calculate reserved balance for new wallet
                await calculateReservedBalance();
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
                if (isMountedRef.current) {
                    setWalletExists(true);
                }
                // Try to fetch the existing wallet
                try {
                    const existingWallet = await container.wallet.balance.get.execute();
                    if (isMountedRef.current) {
                        setWalletData(existingWallet);
                        setError(null);
                        await calculateReservedBalance();
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
     * - Always fetches reserved balance
     */
    const fetchBalance = useCallback(async (isInitialFetch: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const data = await container.wallet.balance.get.execute();

            if (isMountedRef.current) {
                setWalletData(data);
                setWalletExists(true);
                // Fetch reserved balance
                await calculateReservedBalance();
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch wallet balance';

            const isWalletNotFound =
                errorMessage.toLowerCase().includes('wallet not found') ||
                errorMessage.toLowerCase().includes('not found for this user');

            // Auto-create only on initial fetch when wallet doesn't exist
            if (isWalletNotFound && isInitialFetch && !isCreatingRef.current && !walletExists) {
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
    }, [walletExists, calculateReservedBalance]);

    /**
     * Manual refresh - always fetches to get updated balance
     * Does NOT auto-create wallet on refresh (user must wait for initial load)
     */
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await container.wallet.balance.get.execute();

            if (isMountedRef.current) {
                setWalletData(data);
                setWalletExists(true);
                // Refresh reserved balance
                await calculateReservedBalance();
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to refresh wallet';

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
    }, [walletData, calculateReservedBalance]);

    // Initial fetch on mount - only once
    useEffect(() => {
        if (hasInitializedRef.current) {
            return;
        }

        hasInitializedRef.current = true;
        isMountedRef.current = true;
        fetchBalance(true);

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const actualBalance = walletData?.balance ?? null;
    const available = actualBalance !== null ? Math.max(0, actualBalance - reservedBalance) : null;

    return {
        balance: actualBalance,
        availableBalance: available,
        reservedBalance,
        renterId: walletData?.renterId ?? null,
        loading: loading || creating,
        error: error || createError,
        creating,
        createError,
        hasWallet: walletExists || walletData !== null,
        pendingWithdrawalsCount,
        refresh,
        createWallet,
    };
};