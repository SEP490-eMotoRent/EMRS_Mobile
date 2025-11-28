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

export const useWallet = (): UseWalletResult => {
    const [walletData, setWalletData] = useState<WalletBalanceResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState<boolean>(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [walletExists, setWalletExists] = useState(false);
    
    const isCreatingRef = useRef(false);
    const isMountedRef = useRef(true);
    const hasInitializedRef = useRef(false);

    const getWalletBalanceUseCase = useRef(sl.getGetWalletBalanceUseCase()).current;
    const createWalletUseCase = useRef(sl.getCreateWalletUseCase()).current;

    const createWalletInternal = async (): Promise<CreateWalletResponse | null> => {
        if (walletExists || isCreatingRef.current) {
            console.log('⚠️ Skipping wallet creation - already exists or in progress');
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
                setLoading(false); // Important: stop loading here
            }
            
            return data;
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to create wallet';
            console.error('❌ Create wallet error:', errorMsg);
            
            if (errorMsg.toLowerCase().includes('already exists') || 
                errorMsg.toLowerCase().includes('already have')) {
                console.log('⚠️ Backend says wallet exists, fetching...');
                if (isMountedRef.current) {
                    setWalletExists(true);
                }
                try {
                    const existingWallet = await getWalletBalanceUseCase.execute();
                    if (isMountedRef.current) {
                        setWalletData(existingWallet);
                        setError(null);
                    }
                } catch {
                    // Ignore
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

    const createWallet = useCallback(async (): Promise<CreateWalletResponse | null> => {
        return createWalletInternal();
    }, [walletExists]);

    const fetchBalance = useCallback(async (isInitialFetch: boolean = false) => {
        // Skip if we already have wallet data from creation
        if (walletExists && walletData !== null && !isInitialFetch) {
            console.log('⏭️ Skipping fetch - wallet data already present');
            return;
        }

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
            
            // Only auto-create on initial fetch
            if (isWalletNotFound && isInitialFetch && !isCreatingRef.current && !walletExists) {
                console.log('🔄 Wallet not found, auto-creating...');
                await createWalletInternal();
                return; // Don't set error - createWalletInternal handles state
            } 
            
            // If we already created wallet but fetch still fails, don't overwrite
            if (walletExists && walletData !== null) {
                console.log('⚠️ Fetch failed but we have local wallet data, keeping it');
                return;
            }
            
            if (isMountedRef.current && !walletExists) {
                setError(errorMessage);
            }
        } finally {
            if (isMountedRef.current && !isCreatingRef.current) {
                setLoading(false);
            }
        }
    }, [getWalletBalanceUseCase, walletExists, walletData]);

    const refresh = useCallback(async () => {
        console.log('🔃 Manual refresh requested');
        // If wallet was just created, skip the fetch
        if (walletExists && walletData !== null) {
            console.log('⏭️ Wallet exists locally, skipping refresh');
            return;
        }
        await fetchBalance(false);
    }, [fetchBalance, walletExists, walletData]);

    useEffect(() => {
        if (hasInitializedRef.current) {
            console.log('⏭️ Already initialized, skipping');
            return;
        }
        
        hasInitializedRef.current = true;
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