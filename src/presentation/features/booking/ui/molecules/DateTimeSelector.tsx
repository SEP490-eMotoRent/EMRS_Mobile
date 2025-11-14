import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DateTimeModal } from "../../../../common/components/organisms/bookingSearchBar/DateTimeModal";

interface DateTimeSelectorProps {
    startDate: string;
    endDate: string;
    onDateRangeChange: (dateRange: string) => void;
    duration?: string; // Optional: pass duration to display between cards
}

// Helper to parse Vietnamese date format and get day of week
const getDayOfWeek = (dateStr: string): string => {
    const monthMap: { [key: string]: number } = {
        "Tháng 1": 0, "Tháng 2": 1, "Tháng 3": 2, "Tháng 4": 3,
        "Tháng 5": 4, "Tháng 6": 5, "Tháng 7": 6, "Tháng 8": 7,
        "Tháng 9": 8, "Tháng 10": 9, "Tháng 11": 10, "Tháng 12": 11
    };
    
    const match = dateStr.match(/(Tháng \d+)\s+(\d+)/);
    if (!match) return "";
    
    const monthStr = match[1];
    const day = parseInt(match[2], 10);
    const monthIndex = monthMap[monthStr];
    const year = new Date().getFullYear();
    
    const date = new Date(year, monthIndex, day);
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    return days[date.getDay()];
};

// Helper to format date in Vietnamese style (14 tháng 11)
const formatDateDisplay = (dateStr: string): { dayOfWeek: string; date: string; time: string } => {
    const dayOfWeek = getDayOfWeek(dateStr);
    const match = dateStr.match(/Tháng (\d+)\s+(\d+)\s+(.+)/);
    
    if (!match) {
        return { dayOfWeek: "", date: dateStr, time: "" };
    }
    
    const month = match[1];
    const day = match[2];
    const time = match[3];
    
    return {
        dayOfWeek,
        date: `${day} tháng ${month}`, // ✅ Vietnamese format: "14 tháng 11"
        time,
    };
};

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
    startDate,
    endDate,
    onDateRangeChange,
    duration,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleConfirm = (dateRange: string) => {
        onDateRangeChange(dateRange);
        setModalVisible(false);
    };

    const startFormatted = formatDateDisplay(startDate);
    const endFormatted = formatDateDisplay(endDate);

    return (
        <>
            <View style={styles.container}>
                {/* Pickup Date Card - Compact */}
                <TouchableOpacity 
                    style={styles.dateCard} 
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>◐</Text>
                        </View>
                        <Text style={styles.cardTitle}>Nhận xe</Text>
                    </View>
                    <View style={styles.cardContentCompact}>
                        <View style={styles.dateColumn}>
                            <Text style={styles.dayOfWeek}>{startFormatted.dayOfWeek}</Text>
                            <Text style={styles.dateText}>{startFormatted.date}</Text>
                        </View>
                        <View style={styles.timeColumn}>
                            <Text style={styles.timeText}>{startFormatted.time}</Text>
                            <Text style={styles.editText}>Thay đổi ›</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Duration Badge - MOVED: Now below return card */}
                {/* Spacer between cards */}
                <View style={styles.cardSpacer} />

                {/* Return Date Card - Compact */}
                <TouchableOpacity 
                    style={styles.dateCard} 
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>◑</Text>
                        </View>
                        <Text style={styles.cardTitle}>Trả xe</Text>
                    </View>
                    <View style={styles.cardContentCompact}>
                        <View style={styles.dateColumn}>
                            <Text style={styles.dayOfWeek}>{endFormatted.dayOfWeek}</Text>
                            <Text style={styles.dateText}>{endFormatted.date}</Text>
                        </View>
                        <View style={styles.timeColumn}>
                            <Text style={styles.timeText}>{endFormatted.time}</Text>
                            <Text style={styles.editText}>Thay đổi ›</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Duration Badge - NOW BELOW with bigger styling */}
                {duration && (
                    <View style={styles.durationBadgeBottom}>
                        <View style={styles.badgeLarge}>
                            <Text style={styles.badgeIconLarge}>⏱</Text>
                            <Text style={styles.badgeTextLarge}>{duration}</Text>
                        </View>
                    </View>
                )}
            </View>

            <DateTimeModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleConfirm}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    dateCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    cardSpacer: {
        height: 12, // Space between pickup and return cards
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        fontSize: 18,
        color: "#d4c5f9",
    },
    cardTitle: {
        color: "#d4c5f9",
        fontSize: 15,
        fontWeight: "700",
    },
    // Compact horizontal layout
    cardContentCompact: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateColumn: {
        flex: 1,
        gap: 4,
    },
    timeColumn: {
        alignItems: "flex-end",
        gap: 4,
    },
    dayOfWeek: {
        color: "#999",
        fontSize: 12,
        fontWeight: "600",
    },
    dateText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    timeText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    editText: {
        color: "#d4c5f9",
        fontSize: 12,
        fontWeight: "600",
    },
    
    // ✅ NEW: Duration badge at bottom (bigger!)
    durationBadgeBottom: {
        alignItems: "center",
        marginTop: 16,
    },
    badgeLarge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2a2a2a",
        paddingHorizontal: 24, // ✅ Bigger padding
        paddingVertical: 12,   // ✅ Bigger padding
        borderRadius: 24,      // ✅ Bigger radius
        borderWidth: 2,
        borderColor: "#d4c5f9",
        gap: 10,               // ✅ More space between icon and text
        shadowColor: "#d4c5f9",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    badgeIconLarge: {
        fontSize: 18,          // ✅ Bigger icon
        color: "#d4c5f9",
    },
    badgeTextLarge: {
        color: "#d4c5f9",
        fontSize: 16,          // ✅ Bigger text
        fontWeight: "700",
    },
});