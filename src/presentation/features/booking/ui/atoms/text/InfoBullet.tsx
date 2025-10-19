import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InfoBulletProps {
    text: string;
}

export const InfoBullet: React.FC<InfoBulletProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
    },
    bullet: {
        color: "#999",
        fontSize: 14,
        marginRight: 8,
        lineHeight: 20,
    },
    text: {
        color: "#999",
        fontSize: 13,
        flex: 1,
        lineHeight: 20,
    },
});