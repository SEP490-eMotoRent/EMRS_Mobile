import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface HeaderProps {
    title: string;
    subtitle: string;
    onBack: () => void;
    onNotification?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
        title,
        subtitle,
        onBack,
        onNotification,
    }) => {
        return (
            <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                <Text style={styles.headerIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{title}</Text>
                <Text style={styles.headerSubtitle}>{subtitle}</Text>
            </View>
            {onNotification && (
                <TouchableOpacity onPress={onNotification} style={styles.headerButton}>
                <Text style={styles.headerIcon}>🔔</Text>
                </TouchableOpacity>
            )}
            </View>
        );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    headerButton: {
        padding: 8,
    },
    headerIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    headerContent: {
        flex: 1,
        marginLeft: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
});