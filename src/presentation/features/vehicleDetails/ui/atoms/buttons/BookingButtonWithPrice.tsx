import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BookingButtonWithPriceProps {
    pricePerDay: number;
    dateRange: string;
    onPress: () => void;
    disabled?: boolean;
}

function formatDateRangeVietnamese(dateRange: string): string {
    if (!dateRange) return '';

    const monthMap: Record<string, string> = {
        'Jan': 'Thg 1', 'Feb': 'Thg 2', 'Mar': 'Thg 3',
        'Apr': 'Thg 4', 'May': 'Thg 5', 'Jun': 'Thg 6',
        'Jul': 'Thg 7', 'Aug': 'Thg 8', 'Sep': 'Thg 9',
        'Oct': 'Thg 10', 'Nov': 'Thg 11', 'Dec': 'Thg 12',
    };

    const timeMap: Record<string, string> = {
        'AM': 'SA', 'PM': 'CH',
    };

    let formatted = dateRange;

    Object.entries(monthMap).forEach(([eng, viet]) => {
        formatted = formatted.replace(new RegExp(`\\b${eng}\\b`, 'g'), viet);
    });

    Object.entries(timeMap).forEach(([eng, viet]) => {
        formatted = formatted.replace(new RegExp(`\\b${eng}\\b`, 'g'), viet);
    });

    formatted = formatted.replace(/(Thg \d+) (\d+)/g, '$2 $1');

    return formatted;
}

export const BookingButtonWithPrice: React.FC<BookingButtonWithPriceProps> = ({ 
        pricePerDay,
        dateRange,
        onPress,
        disabled = false
    }) => {
        const formattedDateRange = formatDateRangeVietnamese(dateRange);
        
        return (
            <View style={styles.container}>
                <View style={styles.splitContainer}>
                    <View style={styles.priceSection}>
                        <Text 
                            style={styles.priceText}
                            allowFontScaling={false}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            minimumFontScale={0.85}
                        >
                            {pricePerDay.toLocaleString('vi-VN')}đ / ngày
                        </Text>
                        <Text 
                            style={styles.dateText} 
                            numberOfLines={1}
                            allowFontScaling={false}
                            adjustsFontSizeToFit={true}
                            minimumFontScale={0.85}
                        >
                            {formattedDateRange}
                        </Text>
                    </View>
                    
                    <TouchableOpacity
                        style={[
                            styles.button,
                            disabled && styles.buttonDisabled
                        ]}
                        onPress={onPress}
                        activeOpacity={0.8}
                        disabled={disabled}
                    >
                        <Text 
                            style={[
                                styles.buttonText,
                                disabled && styles.buttonTextDisabled
                            ]}
                            allowFontScaling={false}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            minimumFontScale={0.85}
                        >
                            Đặt xe
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    splitContainer: {
        flexDirection: "row",
        padding: 16,
        gap: 12,
        alignItems: "center",
    },
    priceSection: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    priceText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        includeFontPadding: false,
        textAlignVertical: "center",
    },
    dateText: {
        color: "#9ca3af",
        fontSize: 13,
        fontWeight: "500",
        includeFontPadding: false,
        textAlignVertical: "center",
    },
    button: {
        backgroundColor: "#a78bfa",
        paddingVertical: 16,
        paddingHorizontal: 36,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        minWidth: 120,
        minHeight: 56,
    },
    buttonDisabled: {
        backgroundColor: "#4b5563",
        opacity: 0.5,
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        includeFontPadding: false,
        textAlignVertical: "center",
        paddingHorizontal: 4,
    },
    buttonTextDisabled: {
        color: "#9ca3af",
    },
});