import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BackButton } from "../../../../common/components/atoms/buttons/BackButton";

interface PageHeaderProps {
    title: string;
    onBack: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack }) => {
    return (
        <View style={styles.container}>
            <BackButton onPress={onBack} />
            <Text style={styles.title}>{title}</Text>
            <View style={styles.placeholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        flex: 1,
        textAlign: "center",
        marginRight: 40, // Offset for back button
    },
    placeholder: {
        width: 40,
    },
});