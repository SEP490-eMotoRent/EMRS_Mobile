import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from '../../atoms/icons/Icon';

export interface DescriptionSectionProps {
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
    value,
    onChangeText,
    error,
}) => {
    const charCount = value.length;
    const maxChars = 500;
    const minChars = 10;
    const isValid = charCount >= minChars;

    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Icon name="document" size={20} color="#d4c5f9" />
                <Text style={styles.title}>Mô tả sự cố *</Text>
            </View>
            <Text style={styles.hint}>
                <Icon name="info" size={12} color="#666" /> Mô tả chi tiết sự cố (tối thiểu {minChars} ký tự)
            </Text>
            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                <TextInput
                    multiline
                    placeholder="Nhập mô tả chi tiết về sự cố đã xảy ra..."
                    placeholderTextColor="#666"
                    value={value}
                    onChangeText={onChangeText}
                    numberOfLines={6}
                    maxLength={maxChars}
                    textAlignVertical="top"
                    style={styles.input}
                />
            </View>
            <View style={styles.footer}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <Icon name="warning" size={14} color="#ef4444" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <View style={styles.statusContainer}>
                        {isValid ? (
                            <>
                                <Icon name="checkmark" size={14} color="#22c55e" />
                                <Text style={styles.validText}>Đủ ký tự</Text>
                            </>
                        ) : (
                            <>
                                <Icon name="info" size={14} color="#fbbf24" />
                                <Text style={styles.warningText}>
                                    Còn {minChars - charCount} ký tự
                                </Text>
                            </>
                        )}
                    </View>
                )}
                <Text style={[styles.charCount, charCount > maxChars * 0.9 && styles.charCountWarning]}>
                    {charCount}/{maxChars}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    hint: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
        lineHeight: 18,
    },
    inputContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        padding: 12,
    },
    inputContainerError: {
        borderColor: '#ef4444',
        backgroundColor: '#1a0f0f',
    },
    input: {
        fontSize: 14,
        color: '#fff',
        minHeight: 120,
        padding: 0,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    errorText: {
        fontSize: 13,
        color: '#ef4444',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    validText: {
        fontSize: 13,
        color: '#22c55e',
        fontWeight: '500',
    },
    warningText: {
        fontSize: 13,
        color: '#fbbf24',
        fontWeight: '500',
    },
    charCount: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'monospace',
    },
    charCountWarning: {
        color: '#fbbf24',
    },
});