import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar: React.FC = () => (
    <View style={styles.container}>
        <Ionicons name="search-outline" size={18} color="#aaa" />
        <TextInput
        style={styles.input}
        placeholder="Search For An Address"
        placeholderTextColor="#aaa"
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 12,
        margin: 16,
    },
    input: {
        flex: 1,
        color: '#fff',
        marginLeft: 8,
    },
});
