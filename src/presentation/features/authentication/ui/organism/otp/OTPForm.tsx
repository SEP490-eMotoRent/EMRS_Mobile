// src/features/auth/components/organism/otp/OTPForm.tsx
import React, { useCallback, useRef, useState } from 'react';
import { 
    ActivityIndicator, 
    StyleSheet, 
    Text, 
    TextInput, 
    View, 
    ViewStyle 
} from 'react-native';
import { Button } from '../../../../../common/components/atoms/buttons/Button';
import { colors } from '../../../../../common/theme/colors';
import { OTPInput } from '../../atoms/OTPVerify/OTPInput';
import { ResendCodeButton } from '../../atoms/OTPVerify/ResendCodeButton';

const OTP_LENGTH = 6;

interface OTPFormProps {
    onVerify: (code: string) => void;
    onResend: () => void;
    loading?: boolean;
    resending?: boolean;
    email: string;
}

export const OTPForm: React.FC<OTPFormProps> = ({ 
    onVerify, 
    onResend, 
    loading = false,
    resending = false,
    email 
}) => {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const isCodeComplete = otp.every(digit => digit !== '');
    const isDisabled = loading || resending;

    const handleChangeText = useCallback((text: string, index: number) => {
        // Only allow numbers
        if (text && !/^\d+$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input when typing
        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all digits are entered
        if (text && index === OTP_LENGTH - 1) {
            const fullCode = [...newOtp.slice(0, OTP_LENGTH - 1), text].join('');
            if (fullCode.length === OTP_LENGTH) {
                setTimeout(() => onVerify(fullCode), 100);
            }
        }
    }, [otp, onVerify]);

    const handleKeyPress = useCallback((e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move to previous input and clear it
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            } else if (otp[index]) {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    }, [otp]);

    const handleVerify = useCallback(() => {
        const code = otp.join('');
        if (code.length === OTP_LENGTH) {
            onVerify(code);
        }
    }, [otp, onVerify]);

    const handleResend = useCallback(() => {
        // Clear OTP inputs when resending
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        onResend();
    }, [onResend]);

    const verifyButtonStyle: ViewStyle = {
        ...styles.verifyButton,
        ...((!isCodeComplete || loading) && styles.verifyButtonDisabled)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xác minh email</Text>
            <Text style={styles.subtitle}>
                Chúng tôi đã gửi mã {OTP_LENGTH} chữ số đến{'\n'}
                <Text style={styles.email}>{email}</Text>
            </Text>

            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <OTPInput
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        value={digit}
                        index={index}
                        onChangeText={handleChangeText}
                        onKeyPress={handleKeyPress}
                        editable={!isDisabled}
                    />
                ))}
            </View>

            <Button
                title={loading ? 'Đang xác minh...' : 'Xác minh'}
                onPress={handleVerify}
                variant="primary"
                style={verifyButtonStyle}
                textStyle={styles.verifyButtonText}
                disabled={!isCodeComplete || loading}
            />

            {loading && (
                <ActivityIndicator 
                    size="small" 
                    color={colors.button.primary} 
                    style={styles.loader} 
                />
            )}

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Chưa nhận được mã? </Text>
                <ResendCodeButton 
                    onPress={handleResend} 
                    disabled={isDisabled}
                    loading={resending}
                />
            </View>

            <Text style={styles.expiryHint}>
                Mã xác minh có hiệu lực trong 10 phút
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 20,
    },
    title: {
        color: colors.text.primary,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    email: {
        color: colors.text.primaryLight,
        fontWeight: '600',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
        gap: 8,
    },
    verifyButton: {
        backgroundColor: colors.button.primary,
        borderWidth: 0,
        height: 56,
        borderRadius: 28,
        marginTop: 10,
    },
    verifyButtonDisabled: {
        backgroundColor: '#333333',
        opacity: 0.5,
    },
    verifyButtonText: {
        color: colors.button.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 15,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    resendText: {
        color: colors.text.secondary,
        fontSize: 14,
    },
    expiryHint: {
        color: colors.text.secondary,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 16,
        opacity: 0.7,
    },
});