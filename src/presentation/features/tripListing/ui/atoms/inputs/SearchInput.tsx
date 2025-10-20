import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ placeholder, value, onChangeText }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    input: {
        color: "#fff",
        fontSize: 11,
    },
});
