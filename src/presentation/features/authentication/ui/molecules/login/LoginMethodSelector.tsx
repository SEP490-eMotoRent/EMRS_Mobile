// src/features/auth/components/molecules/LoginMethodSelector.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LoginMethodSelectorProps {
    selectedMethod: 'credentials' | 'phone';
    onMethodChange: (method: 'credentials' | 'phone') => void;
}

export const LoginMethodSelector: React.FC<LoginMethodSelectorProps> = ({
    selectedMethod,
    onMethodChange,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.tab,
                    selectedMethod === 'credentials' && styles.tabActive
                ]}
                onPress={() => onMethodChange('credentials')}
            >
                <Text style={[
                    styles.tabText,
                    selectedMethod === 'credentials' && styles.tabTextActive
                ]}>
                    Username
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={[
                    styles.tab,
                    selectedMethod === 'phone' && styles.tabActive
                ]}
                onPress={() => onMethodChange('phone')}
            >
                <Text style={[
                    styles.tabText,
                    selectedMethod === 'phone' && styles.tabTextActive
                ]}>
                    Số Điện Thoại
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 28,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 24,
    },
    tabActive: {
        backgroundColor: '#b8a4ff',
    },
    tabText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#000',
    },
});