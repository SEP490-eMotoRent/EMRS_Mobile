// useVNPayWebViewHandler.ts
import { useEffect, useRef } from 'react';
import { Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingStackParamList } from '../../../shared/navigation/StackParameters/types';

type NavigationProp = StackNavigationProp<BookingStackParamList>;

interface VNPayDeepLinkParams {
    vnp_ResponseCode?: string;
    vnp_TxnRef?: string;
    vnp_Amount?: string;
    vnp_OrderInfo?: string;
    vnp_TransactionNo?: string;
    vnp_BankCode?: string;
}

interface BookingContext {
    bookingId: string;
    vehicleId: string;
    vehicleName: string;
    vehicleImageUrl?: string;
    startDate: string;
    endDate: string;
    duration: string;
    rentalDays: number;
    branchName: string;
    insurancePlan: string;
    totalAmount: string;
    securityDeposit: string;
    timestamp: string;
}

export const useVNPayWebViewHandler = (webViewRef: any, bookingId: string) => {
    const navigation = useNavigation<NavigationProp>();
    const hasHandledRef = useRef(false);

    const parseVnpAmount = (vnpAmount?: string): number => {
        if (!vnpAmount) return 0;
        const num = Number(vnpAmount);
        return isNaN(num) ? 0 : num / 100;
    };

    const formatVND = (amount: number | string): string => {
        const num = typeof amount === 'string' ? parseInt(amount, 10) : amount;
        if (isNaN(num)) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(num);
    };

    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            console.log("Deep link received:", event.url);
            if (hasHandledRef.current) return;
            handleCallbackUrl(event.url);
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);
        Linking.getInitialURL().then(url => url && handleCallbackUrl(url));

        return () => subscription.remove();
    }, []);

    const handleCallbackUrl = async (url: string) => {
        if (!url.includes('emrs://payment/callback')) return;

        const params = parseQueryParams(url);
        const responseCode = params.vnp_ResponseCode;
        const txnRef = params.vnp_TxnRef;

        if (!responseCode || !txnRef) return;

        hasHandledRef.current = true;
        const context = await getBookingContext(txnRef);

        const displayAmount = context ? context.securityDeposit : parseVnpAmount(params.vnp_Amount);
        const formattedAmount = formatVND(displayAmount);

        if (responseCode === '00') {
            if (context) {
                Alert.alert(
                    "Thanh toán thành công",
                    `Đã thanh toán: ${formattedAmount}\nĐơn đặt xe đã được xác nhận!`,
                    [{
                        text: "OK",
                        onPress: () => {
                            navigation.replace('DigitalContract', {
                                vehicleId: context.vehicleId,
                                vehicleName: context.vehicleName,
                                vehicleImageUrl: context.vehicleImageUrl || "",
                                startDate: context.startDate,
                                endDate: context.endDate,
                                duration: context.duration,
                                rentalDays: context.rentalDays,
                                branchName: context.branchName,
                                insurancePlan: context.insurancePlan,
                                totalAmount: context.totalAmount,
                                securityDeposit: context.securityDeposit,
                                contractNumber: context.bookingId,
                            });
                        }
                    }]
                );
            }
        } else {
            const errorMsg = getVNPayErrorMessage(responseCode);
            Alert.alert("Thanh toán thất bại", `${errorMsg}\nSố tiền: ${formattedAmount}`, [
                { text: "Thử lại", onPress: () => navigation.goBack() },
                { text: "Hủy", style: "cancel" }
            ]);
        }

        if (context) await cleanupBookingContext(txnRef);
        setTimeout(() => { hasHandledRef.current = false; }, 5000);
    };

    const getBookingContext = async (id: string): Promise<BookingContext | null> => {
        try {
            const ctx = await AsyncStorage.getItem(`vnpay_booking_${id}`);
            if (ctx) {
                console.log("Found context for:", id);
                return JSON.parse(ctx);
            }
            return null;
        } catch (e) {
            console.error("Context error:", e);
            return null;
        }
    };

    const cleanupBookingContext = async (id: string) => {
        try {
            await AsyncStorage.removeItem(`vnpay_booking_${id}`);
        } catch (e) { }
    };

    const parseQueryParams = (url: string): VNPayDeepLinkParams => {
        const params: VNPayDeepLinkParams = {};
        const query = url.split('?')[1];
        if (!query) return params;
        query.split('&').forEach(p => {
            const [k, v] = p.split('=');
            if (k && v) params[k as keyof VNPayDeepLinkParams] = decodeURIComponent(v);
        });
        return params;
    };

    const getVNPayErrorMessage = (code: string): string => {
        const map: Record<string, string> = {
            '07': 'Giao dịch bị nghi ngờ gian lận',
            '09': 'Thẻ chưa đăng ký dịch vụ thanh toán online',
            '13': 'Sai OTP',
            '24': 'Khách hàng hủy giao dịch',
            '51': 'Tài khoản không đủ số dư',
            '99': 'Lỗi không xác định',
        };
        return map[code] || `Thanh toán thất bại (Mã: ${code})`;
    };

    // THIS IS THE KEY: Intercept WebView navigation
    const shouldOverrideUrlLoading = (request: { url: string }) => {
        const { url } = request;

        // 1. VNPay payment page → allow
        if (url.includes('sandbox.vnpayment.vn')) {
            console.log("Allowing VNPay page:", url);
            return false;
        }

        // 2. Deep link callback → BLOCK WebView, handle in app
        if (url.includes('emrs://payment/callback')) {
            console.log("Blocking WebView, handling deep link:", url);
            handleCallbackUrl(url);
            return true; // BLOCK navigation
        }

        // 3. Anything else → block (safety)
        return true;
    };

    return { shouldOverrideUrlLoading };
};