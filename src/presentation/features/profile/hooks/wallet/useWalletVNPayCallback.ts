import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { container } from '../../../../../core/di/ServiceContainer';

interface UseWalletVNPayCallbackParams {
    transactionId: string;
    amount: number;
    expiresAt: string;
    onSuccess: () => void;
    onFailure: (errorMessage: string) => void;
    onExpiry: () => void;
}

interface VNPayCallbackDto {
    isSuccess: boolean;
    orderId: string;
    transactionId: string;
    amount: number;
    responseCode: string;
    message: string;
    bankCode: string;
    bankTransactionNo: string;
    cardType: string;
    transactionDate: string;
}

export const useWalletVNPayCallback = ({
    transactionId,
    amount,
    expiresAt,
    onSuccess,
    onFailure,
    onExpiry,
}: UseWalletVNPayCallbackParams) => {
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const expiryTimer = useRef<NodeJS.Timeout | null>(null);
    const hasHandled = useRef(false);

    const processTopUpCallback = container.wallet.topUp.processCallback;
    const STORAGE_KEY = `vnpay_wallet_context_${transactionId}`;

    /**
     * Parse VNPay callback parameters from URL
     */
    const buildDtoFromUrl = useCallback((url: string): VNPayCallbackDto | null => {
        try {
            const u = new URL(url);
            const p = u.searchParams;

            const vnp_ResponseCode = p.get('vnp_ResponseCode');
            const vnp_TxnRef = p.get('vnp_TxnRef');
            const vnp_Amount = p.get('vnp_Amount');
            const vnp_BankCode = p.get('vnp_BankCode');
            const vnp_BankTranNo = p.get('vnp_BankTranNo');
            const vnp_CardType = p.get('vnp_CardType');
            const vnp_PayDate = p.get('vnp_PayDate');
            const vnp_TransactionNo = p.get('vnp_TransactionNo');

            if (!vnp_ResponseCode || !vnp_TxnRef) return null;

            const parsedAmount = vnp_Amount ? parseInt(vnp_Amount) / 100 : 0;
            const formatDate = (d: string) =>
                `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${d.slice(8, 10)}:${d.slice(10, 12)}:${d.slice(12, 14)}+07:00`;

            return {
                isSuccess: vnp_ResponseCode === '00',
                orderId: vnp_TxnRef,
                transactionId: vnp_TransactionNo || '',
                amount: parsedAmount,
                responseCode: vnp_ResponseCode,
                message: vnp_ResponseCode === '00' ? 'Payment success' : 'Payment failed',
                bankCode: vnp_BankCode || '',
                bankTransactionNo: vnp_BankTranNo || '',
                cardType: vnp_CardType || '',
                transactionDate: vnp_PayDate ? formatDate(vnp_PayDate) : new Date().toISOString(),
            };
        } catch (e) {
            console.error('❌ Failed to parse VNPay URL:', e);
            return null;
        }
    }, []);

    /**
     * Get error message from VNPay response code
     */
    const getVNPayErrorMessage = useCallback((code: string): string => {
        const errorMap: Record<string, string> = {
            '07': 'Giao dịch bị nghi ngờ gian lận',
            '09': 'Thẻ chưa đăng ký dịch vụ thanh toán online',
            '13': 'Sai OTP',
            '24': 'Khách hàng hủy giao dịch',
            '51': 'Tài khoản không đủ số dư',
            '99': 'Lỗi không xác định',
        };
        return errorMap[code] || `Thanh toán thất bại (Mã: ${code})`;
    }, []);

    /**
     * Handle deep link callback from VNPay
     */
    const handleDeepLink = useCallback(
        async (url: string) => {
            if (hasHandled.current) {
                // console.log('⚠️ Deep link already handled');
                return;
            }

            // console.log('🔗 Processing wallet deep link:', url);
            hasHandled.current = true;
            setLoading(true);

            const dto = buildDtoFromUrl(url);

            if (!dto) {
                console.error('❌ Invalid deep link format');
                await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
                onFailure('Lỗi xử lý thanh toán');
                return;
            }

            // console.log('📦 VNPay callback data:', dto);

            if (dto.responseCode !== '00') {
                console.error('❌ Payment failed:', dto.message);
                await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
                onFailure(getVNPayErrorMessage(dto.responseCode));
                return;
            }

            // console.log('✅ Payment successful, confirming with backend...');

            try {
                await processTopUpCallback.execute(dto);
                // console.log('✅ Backend confirmed top-up successfully');

                await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
                await new Promise((resolve) => setTimeout(resolve, 1000));
                onSuccess();
            } catch (error: any) {
                // console.error('❌ Callback API failed:', error);

                Alert.alert(
                    'Lỗi xác nhận',
                    'Thanh toán thành công nhưng không thể xác nhận với hệ thống. Vui lòng kiểm tra số dư ví sau vài phút.',
                    [
                        {
                            text: 'Thử lại',
                            onPress: () => {
                                hasHandled.current = false;
                                handleDeepLink(url);
                            },
                        },
                        {
                            text: 'Đóng',
                            onPress: async () => {
                                await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
                                onFailure('Không thể xác nhận thanh toán');
                            },
                        },
                    ]
                );
            }
        },
        [buildDtoFromUrl, getVNPayErrorMessage, processTopUpCallback, STORAGE_KEY, onSuccess, onFailure]
    );

    /**
     * Check if URL should be loaded in WebView
     */
    const shouldStartLoadWithRequest = useCallback((request: any): boolean => {
        const url = request.url || '';
        // console.log('🚦 WebView wants to load:', url);

        if (url.startsWith('emrs://')) {
            // console.log('🛑 Blocking WebView from loading deep link');
            return false;
        }

        return true;
    }, []);

    /**
     * Handle WebView load start
     */
    const handleLoadStart = useCallback(() => {
        setLoading(true);
    }, []);

    /**
     * Handle WebView load end
     */
    const handleLoadEnd = useCallback(() => {
        setLoading(false);
    }, []);

    /**
     * Format time in MM:SS format
     */
    const formatTime = useCallback((seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }, []);

    // Listen for deep links
    useEffect(() => {
        const handleDeepLinkEvent = (event: { url: string }) => {
            // console.log('🔗 Deep link event:', event.url);
            if (event.url.startsWith('emrs://payment/callback')) {
                handleDeepLink(event.url);
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLinkEvent);

        Linking.getInitialURL().then((url) => {
            if (url && url.startsWith('emrs://payment/callback')) {
                handleDeepLink(url);
            }
        });

        return () => subscription.remove();
    }, [handleDeepLink]);

    // Timer countdown
    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
            setTimeLeft(diff);
            if (diff <= 0 && !hasHandled.current) {
                hasHandled.current = true;
                onExpiry();
            }
        };
        tick();
        expiryTimer.current = setInterval(tick, 1000);

        return () => {
            if (expiryTimer.current) clearInterval(expiryTimer.current);
        };
    }, [expiresAt, onExpiry]);

    return {
        loading,
        timeLeft,
        formatTime,
        shouldStartLoadWithRequest,
        handleLoadStart,
        handleLoadEnd,
        hasHandled: hasHandled.current,
    };
};