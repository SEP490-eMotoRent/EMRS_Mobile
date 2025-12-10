import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";

interface DocumentDatePickerProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (date: string) => void;
    initialDate?: string;
    title?: string;
    mode?: 'issue' | 'expiry'; // 'issue' for past dates, 'expiry' for future dates
}

export const DocumentDatePicker: React.FC<DocumentDatePickerProps> = ({
    visible,
    onClose,
    onConfirm,
    initialDate,
    title = "Chọn Ngày",
    mode = 'issue',
}) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate || null);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<string>(() => {
        if (initialDate) return initialDate;
        const today = new Date();
        if (mode === 'issue') {
            // Default to 3 years ago for issue dates
            return new Date(today.getFullYear() - 3, today.getMonth(), today.getDate())
                .toISOString().split("T")[0];
        } else {
            // Default to 5 years in future for expiry dates
            return new Date(today.getFullYear() + 5, today.getMonth(), today.getDate())
                .toISOString().split("T")[0];
        }
    });

    const onDayPress = (day: any) => {
        setSelectedDate(day.dateString);
    };

    const handleConfirm = () => {
        if (selectedDate) {
            // Format date as DD/MM/YYYY
            const date = new Date(selectedDate);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            onConfirm(formattedDate);
            onClose();
        }
    };

    const formatDateDisplay = (dateStr: string | null) => {
        if (!dateStr) return "Chưa chọn ngày";
        const date = new Date(dateStr);
        const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    };

    // Date restrictions based on mode
    const today = new Date();
    let minDate: string;
    let maxDate: string;
    let years: number[];

    if (mode === 'issue') {
        // Issue dates: 1950 to today
        minDate = new Date(1950, 0, 1).toISOString().split("T")[0];
        maxDate = today.toISOString().split("T")[0];
        years = Array.from({ length: today.getFullYear() - 1950 + 1 }, (_, i) => today.getFullYear() - i);
    } else {
        // Expiry dates: today to 50 years in future
        minDate = today.toISOString().split("T")[0];
        maxDate = new Date(today.getFullYear() + 50, 11, 31).toISOString().split("T")[0];
        years = Array.from({ length: 51 }, (_, i) => today.getFullYear() + i);
    }

    const markedDates = selectedDate
        ? {
              [selectedDate]: {
                  selected: true,
                  selectedColor: "#B8A4FF",
                  selectedTextColor: "#000",
              },
          }
        : {};

    const handleYearSelect = (year: number) => {
        const newDate = new Date(year, mode === 'issue' ? 11 : 0, 15);
        const newDateStr = newDate.toISOString().split("T")[0];
        setCurrentMonth(newDateStr);
        setSelectedDate(newDateStr);
        setShowYearPicker(false);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.sheet}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>{title}</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Text style={styles.closeIcon}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Selected Date Display */}
                            <View style={styles.selectedDateContainer}>
                                <Text style={styles.selectedDateLabel}>
                                    {selectedDate ? "Ngày đã chọn:" : "Chọn ngày"}
                                </Text>
                                <Text style={styles.selectedDateText}>
                                    {formatDateDisplay(selectedDate)}
                                </Text>
                            </View>

                            {/* Quick Year Selector Button */}
                            <TouchableOpacity 
                                style={styles.yearSelectorButton}
                                onPress={() => setShowYearPicker(!showYearPicker)}
                            >
                                <Text style={styles.yearSelectorText}>
                                    {showYearPicker ? "Đóng chọn năm" : "Chọn năm nhanh"}
                                </Text>
                                <Text style={styles.yearSelectorIcon}>
                                    {showYearPicker ? "▲" : "▼"}
                                </Text>
                            </TouchableOpacity>

                            {/* Year Picker Grid */}
                            {showYearPicker && (
                                <View style={styles.yearPickerContainer}>
                                    <ScrollView 
                                        style={styles.yearPickerScroll}
                                        showsVerticalScrollIndicator={true}
                                    >
                                        <View style={styles.yearGrid}>
                                            {years.map((year) => {
                                                const isSelected = selectedDate?.startsWith(year.toString());
                                                return (
                                                    <TouchableOpacity
                                                        key={year}
                                                        style={[
                                                            styles.yearItem,
                                                            isSelected && styles.yearItemSelected
                                                        ]}
                                                        onPress={() => handleYearSelect(year)}
                                                    >
                                                        <Text style={[
                                                            styles.yearItemText,
                                                            isSelected && styles.yearItemTextSelected
                                                        ]}>
                                                            {year}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </ScrollView>
                                </View>
                            )}

                            {/* Calendar */}
                            {!showYearPicker && (
                                <View style={styles.calendarContainer}>
                                    <Calendar
                                        markedDates={markedDates}
                                        onDayPress={onDayPress}
                                        maxDate={maxDate}
                                        minDate={minDate}
                                        current={currentMonth}
                                        onMonthChange={(month) => {
                                            setCurrentMonth(month.dateString);
                                        }}
                                        enableSwipeMonths={true}
                                        renderHeader={(date) => {
                                            const monthNames = [
                                                "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
                                                "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
                                                "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
                                            ];
                                            const month = date?.getMonth() ?? 0;
                                            const year = date?.getFullYear() ?? 2025;
                                            return (
                                                <Text style={styles.calendarHeader}>
                                                    {monthNames[month]} {year}
                                                </Text>
                                            );
                                        }}
                                        theme={{
                                            calendarBackground: "#000",
                                            dayTextColor: "#fff",
                                            monthTextColor: "#fff",
                                            arrowColor: "#B8A4FF",
                                            textDisabledColor: "#444",
                                            todayTextColor: "#B8A4FF",
                                            selectedDayBackgroundColor: "#B8A4FF",
                                            selectedDayTextColor: "#000",
                                            textDayFontSize: 16,
                                            textMonthFontSize: 18,
                                        }}
                                        style={styles.calendar}
                                    />
                                </View>
                            )}

                            {/* Action Buttons */}
                            <View style={styles.buttonContainer}>
                                <PrimaryButton 
                                    title="Xác Nhận" 
                                    onPress={handleConfirm}
                                    disabled={!selectedDate}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "flex-end",
    },
    sheet: {
        height: "90%",
        backgroundColor: "#000",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        borderTopWidth: 1,
        borderColor: "#2A2A2A",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    closeButton: {
        padding: 5,
    },
    closeIcon: {
        color: "#fff",
        fontSize: 24,
    },
    selectedDateContainer: {
        backgroundColor: "#1A1A1A",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },
    selectedDateLabel: {
        color: "#9CA3AF",
        fontSize: 14,
        marginBottom: 5,
    },
    selectedDateText: {
        color: "#B8A4FF",
        fontSize: 18,
        fontWeight: "600",
    },
    yearSelectorButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },
    yearSelectorText: {
        color: "#B8A4FF",
        fontSize: 16,
        fontWeight: "500",
    },
    yearSelectorIcon: {
        color: "#B8A4FF",
        fontSize: 16,
    },
    yearPickerContainer: {
        backgroundColor: "#0F0F0F",
        borderRadius: 12,
        marginBottom: 12,
        maxHeight: 400,
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },
    yearPickerScroll: {
        padding: 12,
    },
    yearGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    yearItem: {
        width: "30%",
        aspectRatio: 1.8,
        backgroundColor: "#1A1A1A",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },
    yearItemSelected: {
        backgroundColor: "#B8A4FF",
        borderColor: "#B8A4FF",
    },
    yearItemText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    yearItemTextSelected: {
        color: "#000",
        fontWeight: "700",
    },
    calendarContainer: {
        flex: 1,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    calendarHeader: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        paddingVertical: 10,
    },
    calendar: {
        width: "100%",
        backgroundColor: "#000",
        paddingHorizontal: 8,
    },
    buttonContainer: {
        paddingBottom: 10,
    },
});