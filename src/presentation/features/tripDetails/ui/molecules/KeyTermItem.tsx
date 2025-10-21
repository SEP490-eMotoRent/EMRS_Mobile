import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface KeyTermItemProps {
    text: string;
}

export const KeyTermItem: React.FC<KeyTermItemProps> = ({ text }) => {
    return (
        <View style={styles.container}>
        <View style={styles.bullet} />
        <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#9E9E9E',
        marginTop: 6,
        marginRight: 8,
    },
    text: {
        flex: 1,
        color: '#CCCCCC',
        fontSize: 13,
        lineHeight: 18,
    },
});