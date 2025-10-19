import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TermsHighlightsProps {
    terms: string[];
    onReadFullTerms: () => void;
}

export const TermsHighlights: React.FC<TermsHighlightsProps> = ({ terms, onReadFullTerms }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Terms Highlights</Text>
            <View style={styles.termsList}>
                {terms.map((term, index) => (
                    <View key={index} style={styles.termItem}>
                        <Text style={styles.termNumber}>{index + 1}.</Text>
                        <Text style={styles.termText}>{term}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.readButton} onPress={onReadFullTerms}>
                <Text style={styles.readButtonText}>Read full terms</Text>
                <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
    termsList: {
        marginBottom: 16,
        maxHeight: 120,
    },
    termItem: {
        flexDirection: "row",
        marginBottom: 12,
    },
    termNumber: {
        color: "#d4c5f9",
        fontSize: 13,
        fontWeight: "600",
        marginRight: 8,
        minWidth: 20,
    },
    termText: {
        color: "#d1d5db",
        fontSize: 13,
        flex: 1,
        lineHeight: 20,
    },
    readButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
    },
    readButtonText: {
        color: "#d4c5f9",
        fontSize: 14,
        fontWeight: "600",
        marginRight: 8,
    },
    arrow: {
        color: "#d4c5f9",
        fontSize: 16,
    },
});