import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.container}>
        <Ionicons name="search-outline" size={18} color="#aaa" />
        <TextInput
            style={styles.input}
            placeholder="Search for an Address"
            placeholderTextColor="#aaa"
            editable={false}
            pointerEvents="none"
        />
        </View>
    </TouchableOpacity>
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
