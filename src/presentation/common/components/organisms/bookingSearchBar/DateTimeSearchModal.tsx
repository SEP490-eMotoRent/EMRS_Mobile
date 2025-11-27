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

interface DateTimeSearchModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (dateRange: string) => void;
}

// ✅ CRITICAL: Local date formatting to avoid UTC timezone bugs
const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const DateTimeSearchModal: React.FC<DateTimeSearchModalProps> = ({
    visible,
    onClose,
    onConfirm,
}) => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentTimeType, setCurrentTimeType] = useState<"pickup" | "return">("pickup");
    // ✅ FIXED: Vietnamese format
    const [pickupTime, setPickupTime] = useState("6:00 CH");
    const [returnTime, setReturnTime] = useState("10:00 SA");

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const periods = ["SA", "CH"];

    // ✅ FIXED: Use local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatLocalDate(today);

    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 12);
    maxDate.setMonth(maxDate.getMonth() + 1, 0);
    const maxDateStr = formatLocalDate(maxDate);

    const onDayPress = (day: any) => {
        const selectedDay = new Date(day.dateString);
        
        if (selectedDay < today) {
            return;
        }

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
            const firstDate = new Date(startDate);
            const secondDate = new Date(day.dateString);
            
            const start = firstDate < secondDate ? firstDate : secondDate;
            const end = firstDate < secondDate ? secondDate : firstDate;
            const startStr = formatLocalDate(start);
            const endStr = formatLocalDate(end);

            let currentDate = new Date(start);
            while (currentDate <= end) {
                const dateStr = formatLocalDate(currentDate);
                range[dateStr] = { 
                    color: "#b8a4ff", 
                    textColor: "black",
                };
                currentDate.setDate(currentDate.getDate() + 1);
            }

            range[startStr] = {
                startingDay: true,
                color: "#b8a4ff",
                textColor: "black",
            };
            range[endStr] = {
                endingDay: true,
                color: "#b8a4ff",
                textColor: "black",
            };

            setSelectedDates(range);
            setStartDate(startStr);
            setEndDate(endStr);
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

    const handleTimeConfirm = (hour: number, period: string) => {
        const time = `${hour}:00 ${period}`;
        if (currentTimeType === "pickup") {
            setPickupTime(time);
        } else {
            setReturnTime(time);
        }
        setShowTimePicker(false);
    };

    // ✅ FIXED: Use local timezone for disabled dates
    const markedDatesWithDisabled = { ...selectedDates };
    
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - 1);
    
    for (let i = 0; i < 60; i++) {
        const pastDateStr = formatLocalDate(currentDate);
        if (!markedDatesWithDisabled[pastDateStr]) {
            markedDatesWithDisabled[pastDateStr] = {
                disabled: true,
                disableTouchEvent: true,
            };
        }
        currentDate.setDate(currentDate.getDate() - 1);
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
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Chọn Ngày Nhận Và Trả</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Text style={styles.closeIcon}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.calendarContainer}>
                                <CalendarList
                                    markingType="period"
                                    markedDates={markedDatesWithDisabled}
                                    onDayPress={onDayPress}
                                    pastScrollRange={0}
                                    futureScrollRange={12}
                                    scrollEnabled={true}
                                    minDate={todayStr}
                                    maxDate={maxDateStr}
                                    monthFormat={'MMMM yyyy'}
                                    renderHeader={(date) => {
                                        const monthNames = [
                                            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
                                            "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
                                            "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
                                        ];
                                        const month = date?.getMonth() ?? 0;
                                        const year = date?.getFullYear() ?? 2025;
                                        return (
                                            <Text style={{
                                                color: "#fff",
                                                fontSize: 18,
                                                fontWeight: "600",
                                                textAlign: "center",
                                                paddingVertical: 10,
                                            }}>
                                                {monthNames[month]} {year}
                                            </Text>
                                        );
                                    }}
                                    theme={{
                                        calendarBackground: "#000",
                                        dayTextColor: "#fff",
                                        monthTextColor: "#fff",
                                        arrowColor: "#fff",
                                        textDisabledColor: "#222", // ✅ DARKER disabled color
                                        todayTextColor: "#b8a4ff",
                                        selectedDayBackgroundColor: "#b8a4ff",
                                        selectedDayTextColor: "#000",
                                    }}
                                    style={styles.calendar}
                                />
                            </View>

                            <View style={styles.dateTimeOverlay}>
                                <View style={styles.dateTimeContainer}>
                                    <ScrollView style={styles.dateTimeBoxScroll}>
                                        <View style={styles.dateTimeBox}>
                                            <Text style={styles.dateLabel}>Giờ Nhận</Text>
                                            <TouchableOpacity onPress={() => openTimePicker("pickup")}>
                                                <Text style={styles.timeLabel}>{pickupTime}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                    <ScrollView style={styles.dateTimeBoxScroll}>
                                        <View style={styles.dateTimeBox}>
                                            <Text style={styles.dateLabel}>Giờ Trả</Text>
                                            <TouchableOpacity onPress={() => openTimePicker("return")}>
                                                <Text style={styles.timeLabel}>{returnTime}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </View>
                                <PrimaryButton title="Xác Nhận" onPress={handleConfirm} />
                            </View>

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
    onConfirm: (hour: number, period: string) => void;
    onCancel: () => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({ onConfirm, onCancel }) => {
    const [selectedHour, setSelectedHour] = useState(10);
    const [selectedPeriod, setSelectedPeriod] = useState("SA");

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const periods = ["SA", "CH"];

    const ITEM_HEIGHT = 60;

    const renderPickerColumn = (
        data: any[],
        selected: any,
        onSelect: (val: any) => void,
        width: number = 70
    ) => {
        const scrollViewRef = React.useRef<ScrollView>(null);
        const selectedIndex = data.indexOf(selected);

        React.useEffect(() => {
            if (scrollViewRef.current && selectedIndex >= 0) {
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                        y: selectedIndex * ITEM_HEIGHT,
                        animated: false,
                    });
                }, 50);
            }
        }, [selectedIndex]);

        return (
            <View style={[styles.pickerColumn, { width }]}>
                <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
                    onMomentumScrollEnd={(event) => {
                        const yOffset = event.nativeEvent.contentOffset.y;
                        const index = Math.round(yOffset / ITEM_HEIGHT);
                        if (data[index] !== undefined && data[index] !== selected) {
                            onSelect(data[index]);
                        }
                    }}
                >
                    {data.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={styles.pickerItem}
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
    };

    return (
        <View style={styles.timePickerOverlay}>
            <View style={styles.timePickerSheet}>
                <Text style={styles.timePickerTitle}>Chọn Giờ</Text>
                
                <View style={styles.pickerWrapper}>
                    <View style={styles.selectionIndicator} />
                    
                    <View style={styles.pickerContainer}>
                        {renderPickerColumn(hours, selectedHour, setSelectedHour, 70)}
                        
                        <View style={styles.staticElementContainer}>
                            <Text style={styles.timeSeparator}>:</Text>
                        </View>
                        
                        <View style={styles.staticElementContainer}>
                            <Text style={styles.timeFixed}>00</Text>
                        </View>
                        
                        {renderPickerColumn(periods, selectedPeriod, setSelectedPeriod, 90)}
                    </View>
                </View>
                
                <View style={styles.timePickerActions}>
                    <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={onCancel}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => onConfirm(selectedHour, selectedPeriod)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.confirmButtonText}>Xác Nhận</Text>
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
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        height: "70%",
    },
    calendar: {
        width: "100%",
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
        backgroundColor: "#000",
        justifyContent: "flex-end",
    },
    timePickerSheet: {
        backgroundColor: "#000",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        alignItems: "center",
        width: "100%",
        alignSelf: "stretch",
    },
    timePickerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 30,
    },
    pickerWrapper: {
        position: "relative",
        width: "100%",
        marginBottom: 30,
        height: 180,
    },
    selectionIndicator: {
        position: "absolute",
        top: 60,
        left: "10%",
        right: "10%",
        height: 60,
        backgroundColor: "rgba(184, 164, 255, 0.15)",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "rgba(184, 164, 255, 0.3)",
        zIndex: 0,
        pointerEvents: "none",
    },
    pickerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 180,
        gap: 16,
        zIndex: 1,
    },
    pickerColumn: {
        width: 70,
        height: 180,
        overflow: "hidden",
    },
    staticElementContainer: {
        height: 180,
        justifyContent: "center",
        alignItems: "center",
    },
    pickerItem: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    pickerText: {
        color: "#666",
        fontSize: 24,
        fontWeight: "500",
    },
    pickerTextSelected: {
        color: "#b8a4ff",
        fontSize: 32,
        fontWeight: "700",
    },
    timeSeparator: {
        color: "#b8a4ff",
        fontSize: 32,
        fontWeight: "700",
    },
    timeFixed: {
        color: "#b8a4ff",
        fontSize: 32,
        fontWeight: "700",
        width: 60,
        textAlign: "center",
    },
    timePickerActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#444",
        backgroundColor: "transparent",
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#999",
        fontSize: 16,
        fontWeight: "600",
    },
    confirmButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#b8a4ff",
        alignItems: "center",
        shadowColor: "#b8a4ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    confirmButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
});