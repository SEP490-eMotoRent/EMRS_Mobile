import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export const CalendarIcon = () => (
    <View style={styles.icon}>
        <View style={styles.calendarTop} />
        <View style={styles.calendarBody}>
            <View style={styles.calendarDot} />
            <View style={styles.calendarDot} />
            <View style={styles.calendarDot} />
            <View style={styles.calendarDot} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    icon: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    // Calendar icon
    calendarTop: {
        width: 28,
        height: 4,
        backgroundColor: "#666",
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        marginBottom: 1,
    },
    calendarBody: {
        width: 28,
        height: 22,
        backgroundColor: "#666",
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 3,
        justifyContent: "space-around",
        alignContent: "space-around",
    },
    calendarDot: {
        width: 4,
        height: 4,
        backgroundColor: "#333",
        borderRadius: 2,
    },
});