import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MotorcycleHeaderProps {
    brand: string;
    name: string;
    variant: string;
    branchName: string;
}

export const MotorcycleHeader: React.FC<MotorcycleHeaderProps> = ({ 
    brand, 
    name, 
    variant, 
    branchName 
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{brand} {name}</Text>
            <Text style={styles.variant}>{variant}</Text>
            <Text style={styles.branch}>{branchName}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    variant: {
        color: "#999",
        fontSize: 13,
        marginTop: 4,
    },
    branch: {
        color: "#a855f7",
        fontSize: 11,
        marginTop: 4,
    },
});