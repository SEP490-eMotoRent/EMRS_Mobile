import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShowMoreButton } from "../atoms/buttons/ShowMoreButton";

interface VehicleHeaderProps {
    name: string;
    onShowMore: () => void;
}

export const VehicleHeader: React.FC<VehicleHeaderProps> = ({ name, onShowMore }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{name}</Text>
            <ShowMoreButton onPress={onShowMore} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        padding: 20,
        borderRadius: 24,
        alignItems: "center",
        gap: 16,
        marginBottom: 16,
    },
    name: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },
});
