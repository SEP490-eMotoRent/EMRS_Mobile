// src/features/auth/components/organism/otp/OTPForm.tsx
import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { Button } from '../../../../../common/components/atoms/buttons/Button';
import { OTPInput } from '../../atoms/OTPVerify/OTPInput';
import { ResendCodeButton } from '../../atoms/OTPVerify/ResendCodeButton';

interface OTPFormProps {
    onVerify: (code: string) => void;
    onResend: () => void;
    loading?: boolean;
    email: string;
}

export const OTPForm: React.FC<OTPFormProps> = ({ 
    onVerify, 
    onResend, 
    loading = false,
    email 
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleChangeText = (text: string, index: number) => {
        // Only allow numbers
        if (text && !/^\d+$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // ✅ Auto-focus next input when typing
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // ✅ Auto-verify when all 6 digits are entered
        if (text && index === 5) {
            const fullCode = [...newOtp.slice(0, 5), text].join('');
            if (fullCode.length === 6) {
                // Small delay to show the last digit before verifying
                setTimeout(() => onVerify(fullCode), 100);
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // ✅ Handle backspace - go to previous input
        if (e.nativeEvent.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // If current is empty, go back and clear previous
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            } else if (otp[index]) {
                // If current has value, just clear it
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };

    const handleVerify = () => {
        const code = otp.join('');
        if (code.length === 6) {
            onVerify(code);
        }
    };

    const isCodeComplete = otp.every(digit => digit !== '');

    const verifyButtonStyle: ViewStyle = {
        ...styles.verifyButton,
        ...((!isCodeComplete || loading) && styles.verifyButtonDisabled)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
                We've sent a 6-digit code to{'\n'}
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
                        editable={!loading}
                    />
                ))}
            </View>

            <Button
                title={loading ? 'Verifying...' : 'Verify'}
                onPress={handleVerify}
                variant="primary"
                style={verifyButtonStyle}
                textStyle={styles.verifyButtonText}
                disabled={!isCodeComplete || loading}
            />

            {loading && (
                <ActivityIndicator 
                    size="small" 
                    color="#b8a4ff" 
                    style={styles.loader} 
                />
            )}

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                <ResendCodeButton onPress={onResend} disabled={loading} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 20,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    email: {
        color: '#b8a4ff',
        fontWeight: '600',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    verifyButton: {
        backgroundColor: '#b8a4ff',
        borderWidth: 0,
        height: 56,
        borderRadius: 28,
        marginTop: 10,
    },
    verifyButtonDisabled: {
        backgroundColor: '#444',
        opacity: 0.5,
    },
    verifyButtonText: {
        color: '#000',
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
        marginTop: 20,
    },
    resendText: {
        color: '#888',
        fontSize: 14,
    },
});