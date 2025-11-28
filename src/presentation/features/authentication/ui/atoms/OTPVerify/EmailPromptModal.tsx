import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { colors } from '../../../../../common/theme/colors';

interface EmailPromptModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
    loading?: boolean;
}

export const EmailPromptModal: React.FC<EmailPromptModalProps> = ({
    visible,
    onClose,
    onSubmit,
    loading = false,
}) => {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (email.trim()) {
            onSubmit(email.trim());
            setEmail('');
        }
    };

    const handleClose = () => {
        setEmail('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Nhập email của bạn</Text>
                    <Text style={styles.subtitle}>
                        Vui lòng nhập email đã đăng ký để nhận mã OTP
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor={colors.input.placeholder}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Hủy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button, 
                                styles.submitButton,
                                (!email.trim() || loading) && styles.buttonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={!email.trim() || loading}
                        >
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Đang gửi...' : 'Tiếp tục'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        width: '100%',
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
    },
    title: {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: colors.input.border,
        borderRadius: 12,
        backgroundColor: colors.input.background,
        color: colors.input.text,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: colors.button.primary,
    },
    submitButtonText: {
        color: colors.button.text,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});