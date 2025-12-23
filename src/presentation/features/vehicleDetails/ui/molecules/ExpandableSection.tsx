import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExpandableSectionProps {
    title: string;
    content: string;
    initiallyExpanded?: boolean;
    numberOfLines?: number;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
        title,
        content,
        initiallyExpanded = false,
        numberOfLines = 3,
    }) => {
        const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
        const [isTruncated, setIsTruncated] = useState(false);
        const [showButton, setShowButton] = useState(false);

        // ✅ Detect if text is actually truncated
        const handleTextLayout = (e: any) => {
            if (!isExpanded && e.nativeEvent.lines.length >= numberOfLines) {
            setIsTruncated(true);
            setShowButton(true);
            } else if (!isExpanded) {
            setShowButton(false);
            }
        };

        return (
            <View style={styles.container}>
            <View style={styles.header}>
                <Text 
                style={styles.title}
                allowFontScaling={false}
                numberOfLines={1}
                >
                {title}
                </Text>
            </View>

            <Text
                style={styles.content}
                numberOfLines={isExpanded ? undefined : numberOfLines}
                allowFontScaling={false}
                onTextLayout={handleTextLayout}
            >
                {content}
            </Text>

            {/* ✅ Button at bottom center - only shows if text is truncated */}
            {(showButton || isExpanded) && (
                <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
                >
                <Text 
                    style={styles.buttonText}
                    allowFontScaling={false}
                    numberOfLines={1}
                >
                    {isExpanded ? "Ẩn Bớt" : "Xem Thêm"}
                </Text>
                </TouchableOpacity>
            )}

            {/* ✅ Optional: Show "end" indicator when content is short and fully visible */}
            {!showButton && !isExpanded && content.length > 50 && (
                <View style={styles.endIndicator}>
                <View style={styles.endLine} />
                </View>
            )}
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        includeFontPadding: false,
        textAlignVertical: "center",
    },
    content: {
        color: "#9ca3af",
        fontSize: 14,
        lineHeight: 20,
        includeFontPadding: false,
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 12,
        paddingBottom: 4,
    },
    buttonText: {
        color: "#B8A4FF",
        fontSize: 14,
        fontWeight: "700",
        textAlign: "center",
        includeFontPadding: false,
        textAlignVertical: "center",
    },
    endIndicator: {
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 4,
    },
    endLine: {
        width: 40,
        height: 2,
        backgroundColor: "#2a2a2a",
        borderRadius: 1,
    },
});