import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface AvatarProps {
    name: string;
    size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 60 }) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    
    const dynamicStyle: ViewStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
    };
    
    return (
        <View style={[styles.avatar, dynamicStyle]}>
        <Text style={[styles.avatarText, { fontSize: size / 2.5 }]}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '600',
    },
});