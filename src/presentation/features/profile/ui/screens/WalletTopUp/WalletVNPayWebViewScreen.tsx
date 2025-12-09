import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { PageHeader } from '../../../../booking/ui/molecules/PageHeader';
import { useWalletVNPayCallback } from '../../../hooks/wallet/useWalletVNPayCallback';

type RoutePropType = RouteProp<ProfileStackParamList, 'WalletVNPayWebView'>;
type NavigationProp = StackNavigationProp<ProfileStackParamList, 'WalletVNPayWebView'>;

export const WalletVNPayWebViewScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationProp>();
    const webviewRef = useRef<WebView>(null);

    const { vnpayUrl, transactionId, amount, expiresAt } = route.params;

    const handleSuccess = useCallback(() => {
        navigation.replace('WalletTopUpResult', {
            success: true,
            amount,
            transactionId,
        });
    }, [navigation, amount, transactionId]);

    const handleFailure = useCallback(
        (errorMessage: string) => {
            navigation.replace('WalletTopUpResult', {
                success: false,
                amount,
                errorMessage,
            });
        },
        [navigation, amount]
    );

    const handleExpiry = useCallback(() => {
        Alert.alert('Hết hạn', 'Phiên thanh toán đã hết hạn.', [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    }, [navigation]);

    const {
        loading,
        timeLeft,
        formatTime,
        shouldStartLoadWithRequest,
        handleLoadStart,
        handleLoadEnd,
        hasHandled,
    } = useWalletVNPayCallback({
        transactionId,
        amount,
        expiresAt,
        onSuccess: handleSuccess,
        onFailure: handleFailure,
        onExpiry: handleExpiry,
    });

    const handleBack = useCallback(() => {
        if (hasHandled) {
            navigation.goBack();
            return;
        }
        Alert.alert('Hủy thanh toán?', 'Bạn có chắc muốn hủy nạp tiền?', [
            { text: 'Tiếp tục thanh toán', style: 'cancel' },
            { text: 'Hủy', style: 'destructive', onPress: () => navigation.goBack() },
        ]);
    }, [hasHandled, navigation]);

    const formatCurrency = (value: number): string => {
        return `${value.toLocaleString('vi-VN')}đ`;
    };

    return (
        <View style={styles.container}>
            <PageHeader title="Thanh toán VNPay" onBack={handleBack} />

            {timeLeft > 0 && (
                <View style={styles.timer}>
                    <Text style={styles.timerTxt}>Còn: {formatTime(timeLeft)}</Text>
                </View>
            )}

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Nạp tiền vào ví</Text>
                <View style={styles.row}>
                    <Text style={styles.lbl}>Số tiền:</Text>
                    <Text style={styles.val}>{formatCurrency(amount)}</Text>
                </View>
            </View>

            {loading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.overlayTxt}>Đang tải trang thanh toán...</Text>
                </View>
            )}

            <WebView
                ref={webviewRef}
                source={{ uri: vnpayUrl }}
                style={styles.webview}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
                javaScriptEnabled
                domStorageEnabled
                cacheEnabled={false}
                thirdPartyCookiesEnabled
                sharedCookiesEnabled
            />

            <View style={styles.footer}>
                <Text style={styles.footerTxt}>
                    Sau khi thanh toán, ứng dụng sẽ tự động cập nhật số dư
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    timer: {
        backgroundColor: '#1a1a1a',
        padding: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    timerTxt: { color: '#fbbf24', fontSize: 16, fontWeight: '600' },
    infoCard: {
        backgroundColor: '#1a1a1a',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
    },
    infoTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    lbl: { color: '#999', fontSize: 14 },
    val: { color: '#c4b5fd', fontSize: 16, fontWeight: '700' },
    webview: { flex: 1, marginTop: 16 },
    overlay: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
        marginTop: -40,
    },
    overlayTxt: { color: '#fff', fontSize: 16, marginTop: 12 },
    footer: {
        padding: 16,
        backgroundColor: '#1a1a1a',
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    footerTxt: { color: '#999', fontSize: 14, textAlign: 'center' },
});