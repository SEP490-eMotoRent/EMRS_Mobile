import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface CategoryCard {
    id: string;
    title: string;
    icon: string;
    color: string;
}

export const CategoryCardsSection: React.FC = () => {
    const categories: CategoryCard[] = [
        {
            id: 'self-drive',
            title: 'Thuê xe tự lái',
            icon: '🏍️',
            color: '#8B5CF6', // purple
        },
        {
            id: 'with-driver',
            title: 'Thuê xe có tài',
            icon: '👤',
            color: '#3B82F6', // blue
        },
        {
            id: 'long-term',
            title: 'Thuê xe dài hạn',
            icon: '📅',
            color: '#10B981', // green
        },
    ];

    return (
        <View style={styles.container}>
            {categories.map((category) => (
                <TouchableOpacity
                    key={category.id}
                    style={[styles.card, { backgroundColor: category.color }]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.icon}>{category.icon}</Text>
                    <Text style={styles.title}>{category.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 24,
    },
    card: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    icon: {
        fontSize: 32,
        marginBottom: 8,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});