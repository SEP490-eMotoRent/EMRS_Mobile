import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { PrimaryButton } from "../../../../common/components/atoms/buttons/PrimaryButton";

interface DatePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (date: string) => void;
    initialDate?: string;
    title?: string;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
    visible,
    onClose,
    onConfirm,
    initialDate,
    title = "Chọn Ngày Sinh",
}) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate || null);

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

    // Calculate max date (today) and min date (100 years ago)
    const today = new Date();
    const maxDate = today.toISOString().split("T")[0];
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
        .toISOString()
        .split("T")[0];

    // Initial date for calendar (selected date or 18 years ago)
    const initialCalendarDate = selectedDate || 
        new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
            .toISOString()
            .split("T")[0];

    const markedDates = selectedDate
        ? {
              [selectedDate]: {
                  selected: true,
                  selectedColor: "#b8a4ff",
                  selectedTextColor: "#000",
              },
          }
        : {};

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
                            {selectedDate && (
                                <View style={styles.selectedDateContainer}>
                                    <Text style={styles.selectedDateLabel}>Ngày đã chọn:</Text>
                                    <Text style={styles.selectedDateText}>
                                        {formatDateDisplay(selectedDate)}
                                    </Text>
                                </View>
                            )}

                            {/* Calendar */}
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    markedDates={markedDates}
                                    onDayPress={onDayPress}
                                    maxDate={maxDate}
                                    minDate={minDate}
                                    current={initialCalendarDate}
                                    enableSwipeMonths={true}
                                    theme={{
                                        calendarBackground: "#000",
                                        dayTextColor: "#fff",
                                        monthTextColor: "#fff",
                                        arrowColor: "#b8a4ff",
                                        textDisabledColor: "#555",
                                        todayTextColor: "#b8a4ff",
                                        selectedDayBackgroundColor: "#b8a4ff",
                                        selectedDayTextColor: "#000",
                                        textMonthFontWeight: "600",
                                        textDayFontSize: 16,
                                        textMonthFontSize: 18,
                                    }}
                                    style={styles.calendar}
                                />
                            </View>

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
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    sheet: {
        height: "75%",
        backgroundColor: "#000",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
    closeButton: {
        padding: 5,
    },
    closeIcon: {
        color: "#fff",
        fontSize: 24,
    },
    selectedDateContainer: {
        backgroundColor: "#1a1a1a",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        alignItems: "center",
    },
    selectedDateLabel: {
        color: "#999",
        fontSize: 14,
        marginBottom: 5,
    },
    selectedDateText: {
        color: "#b8a4ff",
        fontSize: 18,
        fontWeight: "600",
    },
    calendarContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    calendar: {
        width: "100%",
        backgroundColor: "#000",
    },
    buttonContainer: {
        paddingBottom: 10,
    },
});