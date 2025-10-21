import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WarningNoteProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    type?: 'warning' | 'info' | 'danger';
}

export const WarningNote: React.FC<WarningNoteProps> = ({
    icon,
    title,
    description,
    type = 'warning'
}) => {
    const getIconColor = () => {
        switch (type) {
        case 'danger':
            return '#F44336';
        case 'info':
            return '#2196F3';
        default:
            return '#FF9800';
        }
    };

    return (
        <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
            {icon}
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        color: '#9E9E9E',
        fontSize: 12,
        lineHeight: 16,
    },
});