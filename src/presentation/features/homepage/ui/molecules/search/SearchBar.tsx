import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SearchBarProps {
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Nhập địa chỉ của bạn' }) => (
    <TouchableOpacity style={styles.container}>
        <Text style={styles.text}>{placeholder}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#1F1F1F',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    text: {
        color: '#9CA3AF', // gray-400
        textAlign: 'center',
    },
});
