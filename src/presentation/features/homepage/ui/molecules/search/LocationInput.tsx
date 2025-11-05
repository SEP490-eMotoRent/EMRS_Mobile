import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface LocationInputProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSubmitEditing?: () => void;
}

export const LocationInput = forwardRef<TextInput, LocationInputProps>(
    ({ value, onChangeText, onSubmitEditing, ...props }, ref) => (
        <View style={styles.container}>
        <Ionicons name="location-outline" size={18} color="#aaa" />
        <TextInput
            ref={ref}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder="Điền vị trí của bạn"
            placeholderTextColor="#aaa"
            returnKeyType="done"
            onSubmitEditing={onSubmitEditing}
            {...props}
        />
        </View>
    )
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        marginLeft: 8,
    },
});
