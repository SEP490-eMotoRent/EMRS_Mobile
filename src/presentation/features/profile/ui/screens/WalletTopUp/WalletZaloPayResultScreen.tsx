import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Linking,
    AppState,
    AppStateStatus,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';
import { SecondaryButton } from '../../../../homepage/ui/atoms/buttons/SecondaryButton';
import { container } from '../../../../../../core/di/ServiceContainer';

type RoutePropType = RouteProp<ProfileStackParamList, 'WalletZaloPayResult'>;
type NavigationPropType = StackNavigationProp<ProfileStackParamList, 'WalletZaloPayResult'>;

interface ZaloPayCallbackData {
    appid?: string;
    apptransid?: string;
    pmcid?: string;
    bankcode?: string;
    amount?: string;
    discountamount?: string;
    status?: string;
    checksum?: string;
}

export const WalletZaloPayResultScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    const appState = useRef(AppState.currentState);

    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [pollingEnabled, setPollingEnabled] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const hasHandled = useRef(false);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { transactionId, amount, zaloPayUrl } = route.params;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 [WALLET ZALOPAY RESULT] SCREEN MOUNTED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Transaction ID:', transactionId);
    console.log('💰 Amount:', amount);
    console.log('🔗 ZaloPay URL:', zaloPayUrl);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ==================== MANUAL POLLING ====================
    useEffect(() => {
        if (!pollingEnabled || paymentStatus !== 'pending' || hasHandled.current) {
            return;
        }

        console.log('🔄 [WALLET ZALOPAY POLLING] Starting polling...');
        console.log('Polling interval: 3 seconds');
        console.log('Timeout: 15 minutes');

        const pollTransactionStatus = async () => {
            try {
                console.log('📡 [POLLING] Fetching transactions...');
                const startTime = Date.now();
                
                const transactions = await container.wallet.transactions.getMy.execute();
                const endTime = Date.now();
                
                console.log(`📊 [POLLING] API call took ${endTime - startTime}ms`);
                console.log(`📊 [POLLING] Found ${transactions.length} total transactions`);
                
                const transaction = transactions.find(t => t.id === transactionId);

                if (!transaction) {
                    console.warn('⚠️ [POLLING] Transaction not found!');
                    console.warn('Looking for ID:', transactionId);
                    console.warn('Available IDs:', transactions.slice(0, 5).map(t => t.id));
                    return;
                }

                console.log('✅ [POLLING] Transaction found:');
                console.log('  - ID:', transaction.id);
                console.log('  - Status:', transaction.status);
                console.log('  - Amount:', transaction.amount);
                console.log('  - Type:', transaction.transactionType);
                console.log('  - Created:', transaction.createdAt);

                if (transaction.status === 'Success' && !hasHandled.current) {
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('✅ [POLLING] PAYMENT SUCCESSFUL!');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('Wallet balance should be updated by backend');
                    console.log('Stopping polling and showing success screen');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    
                    hasHandled.current = true;
                    setPollingEnabled(false);
                    setPaymentStatus('success');
                    clearIntervals();
                    setTimeout(() => navigateToSuccess(), 2000);
                } else if ((transaction.status === 'Failed' || transaction.status === 'Cancelled') && !hasHandled.current) {
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('❌ [POLLING] Payment failed/cancelled');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('Transaction status:', transaction.status);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    
                    hasHandled.current = true;
                    setPollingEnabled(false);
                    setPaymentStatus('failed');
                    setErrorMessage('Giao dịch thất bại');
                    clearIntervals();
                } else {
                    console.log('⏳ [POLLING] Still pending, will check again in 3s');
                }
            } catch (error: any) {
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('❌ [POLLING] ERROR!');
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('Error:', error);
                console.error('Message:', error.message);
                console.error('Stack:', error.stack);
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                // Don't stop polling on error, just log it
            }
        };

        // Initial poll
        pollTransactionStatus();
        
        // Set up interval
        pollingIntervalRef.current = setInterval(pollTransactionStatus, 3000);

        // Set up timeout
        const timeoutId = setTimeout(() => {
            if (!hasHandled.current) {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('⏱️ [POLLING] TIMEOUT REACHED (15 min)');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('Payment was not completed within 15 minutes');
                console.log('If user completed payment, backend may not have updated transaction');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                hasHandled.current = true;
                setPollingEnabled(false);
                setPaymentStatus('failed');
                setErrorMessage('Hết thời gian chờ thanh toán');
                clearIntervals();
            }
        }, 15 * 60 * 1000);

        // Set up elapsed time timer
        timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);

        return () => {
            console.log('🧹 [POLLING] Cleaning up polling timers');
            clearIntervals();
            clearTimeout(timeoutId);
        };
    }, [transactionId, pollingEnabled, paymentStatus]);

    const clearIntervals = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // ==================== HANDLE ZALOPAY CALLBACK ====================
    const handleZaloPayCallback = async (url: string) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📞 [DEEP LINK CALLBACK] RECEIVED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔗 Raw URL:', url);
        console.log('⏰ Timestamp:', new Date().toISOString());
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (hasHandled.current) {
            console.log('⏭️ [CALLBACK] Already handled, skipping');
            console.log('hasHandled.current:', hasHandled.current);
            return;
        }

        if (isProcessing) {
            console.log('⏭️ [CALLBACK] Already processing, skipping');
            console.log('isProcessing:', isProcessing);
            return;
        }

        hasHandled.current = true;
        setIsProcessing(true);
        setPollingEnabled(false);
        clearIntervals();

        console.log('🔒 [CALLBACK] Locked for processing');

        try {
            const params = parseCallbackUrl(url);
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📋 [CALLBACK] PARSED PARAMETERS:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  appid:', params.appid || 'MISSING');
            console.log('  apptransid:', params.apptransid || 'MISSING');
            console.log('  pmcid:', params.pmcid || 'MISSING');
            console.log('  bankcode:', params.bankcode || 'MISSING');
            console.log('  amount:', params.amount || 'MISSING');
            console.log('  discountamount:', params.discountamount || 'MISSING');
            console.log('  status:', params.status || 'MISSING');
            console.log('  checksum:', params.checksum ? params.checksum.substring(0, 20) + '...' : 'MISSING');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            if (!params.status) {
                console.error('❌ [CALLBACK] CRITICAL: Missing status parameter!');
                throw new Error('Missing status in callback');
            }

            console.log('📦 [CALLBACK] Building backend request...');

            const callbackRequest = {
                AppId: parseInt(params.appid || '0'),
                AppTransId: params.apptransid || '',
                PmcId: parseInt(params.pmcid || '0'),
                BankCode: params.bankcode || '',
                Amount: parseInt(params.amount || '0'),
                DiscountAmount: parseInt(params.discountamount || '0'),
                Status: parseInt(params.status || '0'),
                Checksum: params.checksum || '',
                Message: params.status === '1' ? 'Success' : 'Failed'
            };

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📤 [CALLBACK] SENDING TO BACKEND:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Backend endpoint: PUT /api/Wallet/zalopay/callback');
            console.log('Request body:');
            console.log(JSON.stringify({
                ...callbackRequest,
                Checksum: callbackRequest.Checksum.substring(0, 20) + '...'
            }, null, 2));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            console.log('🔄 [CALLBACK] Calling backend processZaloPayCallback...');
            const startTime = Date.now();
            
            const result = await container.wallet.topUp.processZaloPayCallback.execute(callbackRequest);
            
            const endTime = Date.now();
            console.log(`⏱️ [CALLBACK] Backend call took ${endTime - startTime}ms`);
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📥 [CALLBACK] BACKEND RESPONSE:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Result:', result);
            console.log('Type:', typeof result);
            console.log('Is true?', result === true);
            console.log('Is false?', result === false);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            if (result === true) {
                console.log('✅ [CALLBACK] Backend confirmed payment success!');
                console.log('Wallet balance has been updated');
                console.log('Navigating to success screen in 2 seconds...');
                
                setPaymentStatus('success');
                setTimeout(() => navigateToSuccess(), 2000);
            } else {
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('❌ [CALLBACK] Backend returned FALSE!');
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('Backend ProcessTopUpCallBackZaloPay failed');
                console.error('Possible causes:');
                console.error('  1. Checksum validation failed');
                console.error('  2. Transaction already processed');
                console.error('  3. Wallet not found');
                console.error('  4. Database error');
                console.error('Check backend logs for details');
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                setPaymentStatus('failed');
                setErrorMessage('Backend không xác nhận thanh toán');
            }

        } catch (error: any) {
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('❌ [CALLBACK] EXCEPTION!');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('Error:', error);
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
            console.error('Name:', error.name);
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            setPaymentStatus('failed');
            setErrorMessage(error.message || 'Lỗi xử lý callback');
        } finally {
            setIsProcessing(false);
            console.log('🔓 [CALLBACK] Processing complete, unlocked');
        }
    };

    const parseCallbackUrl = (url: string): ZaloPayCallbackData => {
        console.log('🔍 [PARSE] Parsing callback URL...');
        try {
            const urlObj = new URL(url);
            const params: ZaloPayCallbackData = {};
            
            console.log('URL scheme:', urlObj.protocol);
            console.log('URL host:', urlObj.host);
            console.log('URL pathname:', urlObj.pathname);
            
            let paramCount = 0;
            urlObj.searchParams.forEach((value, key) => {
                params[key.toLowerCase() as keyof ZaloPayCallbackData] = value;
                paramCount++;
            });
            
            console.log(`✅ [PARSE] Parsed ${paramCount} parameters`);
            return params;
        } catch (error) {
            console.error('❌ [PARSE] Failed to parse URL!');
            console.error('Error:', error);
            console.error('URL:', url);
            return {};
        }
    };

    const navigateToSuccess = async () => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🧭 [NAVIGATION] Navigating to success screen...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        try {
            await AsyncStorage.removeItem(`zalopay_wallet_context_${transactionId}`);
            console.log('✅ [NAVIGATION] Cleared AsyncStorage context');
        } catch (error) {
            console.error('⚠️ [NAVIGATION] Failed to clear context:', error);
        }
        
        console.log('Target screen: WalletTopUpResult');
        console.log('Params:', { success: true, amount, transactionId });
        
        navigation.replace('WalletTopUpResult', {
            success: true,
            amount,
            transactionId,
        });
        
        console.log('✅ [NAVIGATION] Navigation dispatched');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    };

    // ==================== DEEP LINK LISTENER ====================
    useEffect(() => {
        console.log('🔗 [DEEP LINK] Setting up listeners...');

        const handleDeepLinkEvent = (event: { url: string }) => {
            console.log('🔔 [DEEP LINK EVENT] Received event:', event.url);
            
            if (event.url.startsWith('emrs://payment/callback')) {
                console.log('✅ [DEEP LINK EVENT] This is a payment callback');
                handleZaloPayCallback(event.url);
            } else {
                console.log('⏭️ [DEEP LINK EVENT] Not a payment callback, ignoring');
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLinkEvent);
        console.log('✅ [DEEP LINK] Event listener registered');

        Linking.getInitialURL().then(url => {
            if (url) {
                console.log('🔗 [DEEP LINK] Initial URL found:', url);
                if (url.startsWith('emrs://payment/callback')) {
                    console.log('✅ [DEEP LINK] Initial URL is payment callback');
                    handleZaloPayCallback(url);
                } else {
                    console.log('⏭️ [DEEP LINK] Initial URL is not payment callback');
                }
            } else {
                console.log('🔗 [DEEP LINK] No initial URL');
            }
        });

        return () => {
            console.log('🔗 [DEEP LINK] Removing listener');
            subscription.remove();
        };
    }, [isProcessing]);

    // ==================== APP STATE LISTENER ====================
    useEffect(() => {
        console.log('📱 [APP STATE] Setting up listener...');
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            console.log('📱 [APP STATE] Removing listener');
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📱 [APP STATE] State changed');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Previous state:', appState.current);
        console.log('New state:', nextAppState);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            console.log('📱 [APP STATE] App became active! User returned from ZaloPay');
            console.log('📱 [APP STATE] Checking for deep link...');
            
            Linking.getInitialURL().then(url => {
                if (url) {
                    console.log('🔗 [APP STATE] Found URL:', url);
                    if (url.startsWith('emrs://payment/callback')) {
                        console.log('✅ [APP STATE] URL is payment callback, processing...');
                        handleZaloPayCallback(url);
                    } else {
                        console.log('⏭️ [APP STATE] URL is not payment callback');
                    }
                } else {
                    console.log('🔗 [APP STATE] No URL found');
                    console.log('User may have closed ZaloPay without completing payment');
                }
            });
        }
        
        appState.current = nextAppState;
    };

    // ==================== OPEN ZALOPAY APP ====================
    useEffect(() => {
        const openZaloPayApp = async () => {
            try {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📱 [ZALOPAY APP] Preparing to open ZaloPay...');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('URL:', zaloPayUrl);
                console.log('Waiting 500ms before opening...');
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                console.log('🔍 [ZALOPAY APP] Checking if URL can be opened...');
                const canOpen = await Linking.canOpenURL(zaloPayUrl);
                console.log('Can open URL?', canOpen);
                
                if (canOpen) {
                    console.log('📱 [ZALOPAY APP] Opening URL now...');
                    await Linking.openURL(zaloPayUrl);
                    console.log('✅ [ZALOPAY APP] ZaloPay opened successfully');
                    console.log('User should now see ZaloPay payment screen');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                } else {
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('❌ [ZALOPAY APP] Cannot open URL!');
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('Possible causes:');
                    console.error('  1. ZaloPay app not installed');
                    console.error('  2. Invalid URL format');
                    console.error('  3. URL scheme not supported');
                    console.error('URL:', zaloPayUrl);
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    
                    Alert.alert(
                        'Lỗi',
                        'Không thể mở ZaloPay. Vui lòng cài đặt ứng dụng ZaloPay để tiếp tục.',
                        [{ text: 'OK', onPress: () => navigation.goBack() }]
                    );
                }
            } catch (error) {
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('❌ [ZALOPAY APP] Failed to open!');
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('Error:', error);
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            }
        };
        
        openZaloPayApp();
    }, [zaloPayUrl]);

    const handleRetry = () => {
        console.log('🔄 [USER ACTION] Retry button pressed');
        console.log('Clearing intervals and going back...');
        clearIntervals();
        navigation.goBack();
    };

    const handleGoHome = () => {
        console.log('🏠 [USER ACTION] Go home button pressed');
        console.log('Clearing intervals and navigating to top...');
        clearIntervals();
        navigation.popToTop();
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // ==================== RENDER ====================
    if (paymentStatus === 'success') {
        return (
            <View style={styles.container}>
                <View style={styles.successIcon}>
                    <Text style={styles.iconText}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Nạp tiền thành công!</Text>
                <Text style={styles.successMessage}>Số tiền đã được cộng vào ví</Text>
                <ActivityIndicator size="small" color="#00ff00" style={{ marginTop: 20 }} />
                <Text style={styles.redirectText}>Đang chuyển trang...</Text>
            </View>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <View style={styles.container}>
                <View style={styles.errorIcon}>
                    <Text style={styles.iconText}>✕</Text>
                </View>
                <Text style={styles.errorTitle}>Thanh toán thất bại</Text>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
                <View style={styles.buttonContainer}>
                    <PrimaryButton title="Thử lại" onPress={handleRetry} />
                    <SecondaryButton title="Quay về" onPress={handleGoHome} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.waitingTitle}>Chờ thanh toán...</Text>
            <Text style={styles.waitingMessage}>
                Vui lòng hoàn tất thanh toán trong ZaloPay
            </Text>
            <Text style={styles.amountText}>
                {amount.toLocaleString('vi-VN')}đ
            </Text>
            <Text style={styles.timerText}>
                Thời gian: {formatTime(elapsedTime)}
            </Text>
            <Text style={styles.debugText}>
                ID: {transactionId.substring(0, 8)}...
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
    successIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#00ff00', justifyContent: 'center', alignItems: 'center' },
    errorIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ff4444', justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 60, color: '#000', fontWeight: 'bold' },
    successTitle: { color: '#00ff00', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
    successMessage: { color: '#fff', fontSize: 16, marginTop: 10, textAlign: 'center' },
    errorTitle: { color: '#ff4444', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
    errorMessage: { color: '#999', fontSize: 16, marginTop: 10, textAlign: 'center' },
    waitingTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 20 },
    waitingMessage: { color: '#999', fontSize: 14, marginTop: 10, textAlign: 'center' },
    amountText: { color: '#00ff00', fontSize: 24, fontWeight: '700', marginTop: 20 },
    timerText: { color: '#fbbf24', fontSize: 16, fontWeight: '600', marginTop: 10 },
    debugText: { color: '#666', fontSize: 12, marginTop: 10 },
    redirectText: { color: '#999', fontSize: 14, marginTop: 10 },
    buttonContainer: { marginTop: 40, width: '100%', gap: 12 },
});