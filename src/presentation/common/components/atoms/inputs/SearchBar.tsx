import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        style={styles.touchable}
    >
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="search" size={24} color="#888888" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.mainText}>Bạn muốn thuê xe ở đâu?</Text>
                <Text style={styles.subText}>
                    Ngày nhận <Text style={styles.bullet}>•</Text> Ngày trả
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    touchable: {
        margin: 16,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    iconContainer: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    mainText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    subText: {
        color: '#666666',
        fontSize: 13,
    },
    bullet: {
        color: '#444444',
    },
});