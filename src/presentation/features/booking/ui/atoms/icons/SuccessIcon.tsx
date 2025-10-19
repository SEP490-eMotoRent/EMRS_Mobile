import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";

export const SuccessIcon: React.FC = () => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.circle}>
                <Text style={styles.checkmark}>✓</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderWidth: 3,
        borderColor: "#22c55e",
        justifyContent: "center",
        alignItems: "center",
    },
    checkmark: {
        color: "#22c55e",
        fontSize: 40,
        fontWeight: "700",
    },
});