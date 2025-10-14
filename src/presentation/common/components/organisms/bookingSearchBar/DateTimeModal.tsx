import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";

interface DateTimeModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (dateRange: string) => void;
}

export const DateTimeModal: React.FC<DateTimeModalProps> = ({
    visible,
    onClose,
    onConfirm,
}) => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentTimeType, setCurrentTimeType] = useState<"pickup" | "return">("pickup");
    const [pickupTime, setPickupTime] = useState("6:00 PM");
    const [returnTime, setReturnTime] = useState("10:00 AM");

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = ["00", "30"];
    const periods = ["AM", "PM"];

    const today = new Date("2025-10-14T07:35:00+07:00"); // Set to October 14, 2025, 07:35 AM +07

    const onDayPress = (day: any) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(day.dateString);
            setEndDate(null);
            setSelectedDates({
                [day.dateString]: {
                    startingDay: true,
                    endingDay: true,
                    color: "#b8a4ff",
                    textColor: "black",
                },
            });
        } else {
            const range: { [key: string]: any } = {};
            const start = new Date(startDate);
            const end = new Date(day.dateString);
            if (end < start) return;

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split("T")[0];
                range[dateStr] = { color: "#b8a4ff", textColor: "black" };
            }

            range[startDate] = {
                startingDay: true,
                color: "#b8a4ff",
                textColor: "black",
            };
            range[day.dateString] = {
                endingDay: true,
                color: "#b8a4ff",
                textColor: "black",
            };

            setSelectedDates(range);
            setEndDate(day.dateString);
        }
    };

    const handleConfirm = () => {
        if (startDate && endDate) {
            onConfirm(`${startDate} - ${endDate} (${pickupTime} - ${returnTime})`);
            onClose();
        }
    };

    const openTimePicker = (type: "pickup" | "return") => {
        setCurrentTimeType(type);
        setShowTimePicker(true);
    };

    const handleTimeConfirm = (hour: number, minute: string, period: string) => {
        const time = `${hour}:${minute} ${period}`;
        if (currentTimeType === "pickup") {
            setPickupTime(time);
        } else {
            setReturnTime(time);
        }
        setShowTimePicker(false);
    };

    const formatDateDisplay = (dateStr: string | null) => {
        if (!dateStr) return "Select date";
        const date = new Date(dateStr);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    };

    // Mark past dates as disabled and grayed out
    const markedDatesWithDisabled = { ...selectedDates };
    const currentDate = new Date();
    if (currentDate < today) {
        const pastDate = new Date(today);
        pastDate.setDate(pastDate.getDate() - 1);
        while (pastDate >= currentDate) {
            const pastDateStr = pastDate.toISOString().split("T")[0];
            markedDatesWithDisabled[pastDateStr] = {
                disabled: true,
                disableTouchEvent: true,
                color: "#888",
                textColor: "#888",
            };
            pastDate.setDate(pastDate.getDate() - 1);
        }
    }

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
                                <Text style={styles.headerTitle}>Start And Return Date</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Text style={styles.closeIcon}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Calendar */}
                            <View style={styles.calendarContainer}>
                                <CalendarList
                                    markingType="period"
                                    markedDates={markedDatesWithDisabled}
                                    onDayPress={onDayPress}
                                    pastScrollRange={0}
                                    futureScrollRange={2}
                                    scrollEnabled={true}
                                    minDate={today.toISOString().split("T")[0]}
                                    theme={{
                                        calendarBackground: "#000",
                                        dayTextColor: "#fff",
                                        monthTextColor: "#fff",
                                        arrowColor: "#fff",
                                        textDisabledColor: "#888",
                                        todayTextColor: "#b8a4ff",
                                    }}
                                    style={styles.calendar}
                                />
                            </View>

                            {/* Overlay for Date & Time Display */}
                            <View style={styles.dateTimeOverlay}>
                                <View style={styles.dateTimeContainer}>
                                    <ScrollView style={styles.dateTimeBoxScroll}>
                                        <View style={styles.dateTimeBox}>
                                            <Text style={styles.dateLabel}>Start time</Text>
                                            <TouchableOpacity onPress={() => openTimePicker("pickup")}>
                                                <Text style={styles.timeLabel}>{pickupTime}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                    <ScrollView style={styles.dateTimeBoxScroll}>
                                        <View style={styles.dateTimeBox}>
                                            <Text style={styles.dateLabel}>End time</Text>
                                            <TouchableOpacity onPress={() => openTimePicker("return")}>
                                                <Text style={styles.timeLabel}>{returnTime}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </View>
                                <PrimaryButton onPress={handleConfirm}>Confirm</PrimaryButton>
                            </View>

                            {/* Time Picker Modal */}
                            {showTimePicker && (
                                <TimePickerModal
                                    onConfirm={handleTimeConfirm}
                                    onCancel={() => setShowTimePicker(false)}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

interface TimePickerModalProps {
    onConfirm: (hour: number, minute: string, period: string) => void;
    onCancel: () => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({ onConfirm, onCancel }) => {
    const [selectedHour, setSelectedHour] = useState(10);
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [selectedPeriod, setSelectedPeriod] = useState("AM");

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = ["00", "30"];
    const periods = ["AM", "PM"];

    const ITEM_HEIGHT = 50;

    const renderPickerColumn = (
        data: any[],
        selected: any,
        onSelect: (val: any) => void
    ) => (
        <View style={styles.pickerColumn}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
            >
                {data.map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.pickerItem,
                            selected === item && styles.pickerItemSelected,
                        ]}
                        onPress={() => onSelect(item)}
                    >
                        <Text
                            style={[
                                styles.pickerText,
                                selected === item && styles.pickerTextSelected,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.timePickerOverlay}>
            <View style={styles.timePickerSheet}>
                <Text style={styles.timePickerTitle}>Select time</Text>
                <View style={styles.pickerContainer}>
                    {renderPickerColumn(hours, selectedHour, setSelectedHour)}
                    {renderPickerColumn(minutes, selectedMinute, setSelectedMinute)}
                    {renderPickerColumn(periods, selectedPeriod, setSelectedPeriod)}
                </View>
                <View style={styles.timePickerActions}>
                    <TouchableOpacity style={styles.timeButton} onPress={onCancel}>
                        <Text style={styles.timeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.timeButton}
                        onPress={() => onConfirm(selectedHour, selectedMinute, selectedPeriod)}
                    >
                        <Text style={styles.timeButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    sheet: {
        height: "90%",
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
    calendarContainer: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        height: "70%",
    },
    calendar: {
        width: width - 60,
        height: 320,
    },
    dateTimeOverlay: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "column",
        alignItems: "center",
    },
    dateTimeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        width: "100%",
    },
    dateTimeBoxScroll: {
        flex: 1,
        marginHorizontal: 5,
        maxHeight: 60,
    },
    dateTimeBox: {
        flex: 1,
        backgroundColor: "#2a2a2a",
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        padding: 10,
        alignItems: "center",
        marginHorizontal: 5,
    },
    dateLabel: {
        color: "#ccc",
        fontSize: 12,
        marginBottom: 5,
    },
    timeLabel: {
        color: "#b8a4ff",
        fontSize: 16,
        fontWeight: "500",
    },
    timePickerOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: "#000", // Solid black background
        justifyContent: "flex-end",
    },
    timePickerSheet: {
        backgroundColor: "#000",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 15,
        alignItems: "center",
        width: "100%",
        alignSelf: "stretch",
    },
    timePickerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },
    pickerContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20,
    },
    pickerColumn: {
        width: 60,
        height: 150,
    },
    pickerItem: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    pickerItemSelected: {
        backgroundColor: "rgba(184, 164, 255, 0.2)",
        borderRadius: 5,
    },
    pickerText: {
        color: "#bbb",
        fontSize: 20,
    },
    pickerTextSelected: {
        color: "#b8a4ff",
        fontSize: 22,
        fontWeight: "600",
    },
    timePickerActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    timeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#444",
    },
    timeButtonText: {
        color: "#b8a4ff",
        fontSize: 16,
        fontWeight: "500",
    },
});