import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import {
    Dimensions,
    Modal,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";

interface DateTimeBookingModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (dateRange: string) => void;
    branchName?: string;
    branchOpenTime?: string;
    branchCloseTime?: string;
    initialStartDate?: string;
    initialEndDate?: string;
    initialPickupTime?: string;
    initialReturnTime?: string;
}

const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const arePropsEqual = (prevProps: any, nextProps: any) => {
    if (prevProps.monthDate.getTime() !== nextProps.monthDate.getTime()) return false;
    if (prevProps.minDateStr !== nextProps.minDateStr) return false;
    if (prevProps.onDayPress !== nextProps.onDayPress) return false;

    const getMonthSlice = (monthDate: Date, marked: any) => {
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthStartStr = formatLocalDate(monthStart);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        const monthEndStr = formatLocalDate(monthEnd);

        const slice: { [key: string]: any } = {};
        Object.keys(marked).forEach(key => {
            if (key >= monthStartStr && key <= monthEndStr) {
                slice[key] = marked[key];
            }
        });
        return slice;
    };

    const prevSlice = getMonthSlice(prevProps.monthDate, prevProps.markedDates);
    const nextSlice = getMonthSlice(nextProps.monthDate, nextProps.markedDates);

    return JSON.stringify(prevSlice) === JSON.stringify(nextSlice);
};

// ✅ Memoized month component with optimized equality check
const MonthCalendar = memo(({ 
    monthDate, 
    monthNames,
    markedDates, 
    onDayPress, 
    minDateStr 
}: { 
    monthDate: Date;
    monthNames: string[];
    markedDates: any;
    onDayPress: (day: any) => void;
    minDateStr: string;
}) => {
    const dateString = formatLocalDate(monthDate);
    
    return (
        <View style={styles.monthWrapper}>
            <Text style={styles.monthHeader}>
                {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
            </Text>
            <Calendar
                current={dateString}
                markingType="period"
                markedDates={markedDates}
                onDayPress={onDayPress}
                minDate={minDateStr}
                hideArrows={true}
                hideExtraDays={true}
                disableMonthChange={true}
                renderHeader={() => <View />}
                theme={{
                    calendarBackground: "#000",
                    dayTextColor: "#fff",
                    monthTextColor: "#000",
                    textDisabledColor: "#222",
                    todayTextColor: "#b8a4ff",
                    selectedDayBackgroundColor: "#b8a4ff",
                    selectedDayTextColor: "#000",
                }}
                style={styles.calendar}
            />
        </View>
    );
}, arePropsEqual);

export const DateTimeBookingModal: React.FC<DateTimeBookingModalProps> = ({
    visible,
    onClose,
    onConfirm,
    branchName,
    branchOpenTime = "6:00 SA",
    branchCloseTime = "10:00 CH",
    initialStartDate,
    initialEndDate,
    initialPickupTime = "6:00 CH",
    initialReturnTime = "10:00 SA",
}) => {
    const [startDate, setStartDate] = useState<string | null>(initialStartDate || null);
    const [endDate, setEndDate] = useState<string | null>(initialEndDate || null);
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});
    const [calendarReady, setCalendarReady] = useState(false);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentTimeType, setCurrentTimeType] = useState<"pickup" | "return">("pickup");
    const [pickupTime, setPickupTime] = useState(initialPickupTime);
    const [returnTime, setReturnTime] = useState(initialReturnTime);
    const [validationError, setValidationError] = useState<string | null>(null);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const periods = ["SA", "CH"];

    useEffect(() => {
        if (visible) {
            setCalendarReady(false);
            const timer = setTimeout(() => {
                setCalendarReady(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setCalendarReady(false);
        }
    }, [visible]);

    const now = new Date();
    
    const minDateTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const minDate = new Date(minDateTime);
    minDate.setHours(0, 0, 0, 0);
    const minDateStr = formatLocalDate(minDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatLocalDate(today);

    const [monthsToDisplay, setMonthsToDisplay] = useState<Date[]>([]);

    useEffect(() => {
        if (visible) {
            const initialMonths: Date[] = [];
            const current = new Date(today);
            
            for (let i = 0; i < 4; i++) {
                initialMonths.push(new Date(current));
                current.setMonth(current.getMonth() + 1);
            }
            
            setMonthsToDisplay(initialMonths);
        } else {
            setMonthsToDisplay([]);
        }
    }, [visible, todayStr]);

    const loadMoreMonths = useCallback(() => {
        setMonthsToDisplay(prev => {
            if (prev.length >= 14) return prev;
            
            const lastMonth = prev[prev.length - 1];
            const newMonths: Date[] = [];
            const current = new Date(lastMonth);
            current.setMonth(current.getMonth() + 1);
            
            const maxMonthsToAdd = 14 - prev.length;
            for (let i = 0; i < Math.min(2, maxMonthsToAdd); i++) {
                newMonths.push(new Date(current));
                current.setMonth(current.getMonth() + 1);
            }
            
            return [...prev, ...newMonths];
        });
    }, []);

    const parseBranchTime = (timeStr: string): { hour: number; period: string } => {
        const match = timeStr.match(/(\d+):00\s*(SA|CH)/);
        if (!match) return { hour: 8, period: "SA" };
        return { hour: parseInt(match[1]), period: match[2] };
    };

    const branchOpen = parseBranchTime(branchOpenTime);
    const branchClose = parseBranchTime(branchCloseTime);

    const getAvailableHours = (period: string) => {
        const allHours = Array.from({ length: 12 }, (_, i) => i + 1);
        
        const convertTo24Hour = (hour: number, per: string): number => {
            if (per === 'SA') {
                return hour === 12 ? 0 : hour;
            } else {
                return hour === 12 ? 12 : hour + 12;
            }
        };
        
        const openHour24 = convertTo24Hour(branchOpen.hour, branchOpen.period);
        const closeHour24 = convertTo24Hour(branchClose.hour, branchClose.period);
        
        const availableHours = allHours.filter(h => {
            const hour24 = convertTo24Hour(h, period);
            return hour24 >= openHour24 && hour24 <= closeHour24;
        });
        
        return availableHours.sort((a, b) => {
            const a24 = convertTo24Hour(a, period);
            const b24 = convertTo24Hour(b, period);
            return a24 - b24;
        });
    };

    useEffect(() => {
        if (visible && initialStartDate && initialEndDate) {
            // ✅ Use simple inline calculation like old version
            const range: { [key: string]: any } = {};
            const start = new Date(initialStartDate);
            const end = new Date(initialEndDate);

            if (initialStartDate === initialEndDate) {
                range[initialStartDate] = {
                    startingDay: true,
                    endingDay: true,
                    color: "#b8a4ff",
                    textColor: "black",
                    selected: true,
                    selectedColor: "#7c3aed",
                };
            } else {
                let currentDate = new Date(start);
                while (currentDate <= end) {
                    const dateStr = formatLocalDate(currentDate);
                    range[dateStr] = { 
                        color: "#b8a4ff", 
                        textColor: "black",
                    };
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                range[initialStartDate] = {
                    startingDay: true,
                    color: "#b8a4ff",
                    textColor: "black",
                    selected: true,
                    selectedColor: "#7c3aed",
                };
                range[initialEndDate] = {
                    endingDay: true,
                    color: "#b8a4ff",
                    textColor: "black",
                    selected: true,
                    selectedColor: "#7c3aed",
                };
            }

            setSelectedDates(range);
            setStartDate(initialStartDate);
            setEndDate(initialEndDate);
            setPickupTime(initialPickupTime);
            setReturnTime(initialReturnTime);
        }
    }, [visible, initialStartDate, initialEndDate, initialPickupTime, initialReturnTime]);

    useEffect(() => {
        if (visible) {
            setValidationError(null);
        }
    }, [visible]);

    // ✅ Optimized onDayPress - simple and fast like old version
    const onDayPress = useCallback((day: any) => {
        const selectedDay = new Date(day.dateString);
        
        if (selectedDay < minDate) {
            return;
        }

        if (!startDate || (startDate && endDate)) {
            // First selection
            setStartDate(day.dateString);
            setEndDate(null);
            setSelectedDates({
                [day.dateString]: {
                    startingDay: true,
                    endingDay: true,
                    color: "#b8a4ff",
                    textColor: "black",
                    selected: true,
                    selectedColor: "#7c3aed",
                },
            });
        } else {
            // Second selection
            const range: { [key: string]: any } = {};
            const firstDate = new Date(startDate);
            const secondDate = new Date(day.dateString);
            
            const start = firstDate < secondDate ? firstDate : secondDate;
            const end = firstDate < secondDate ? secondDate : firstDate;
            const startStr = formatLocalDate(start);
            const endStr = formatLocalDate(end);

            if (startStr === endStr) {
                setSelectedDates({
                    [startStr]: {
                        startingDay: true,
                        endingDay: true,
                        color: "#b8a4ff",
                        textColor: "black",
                        selected: true,
                        selectedColor: "#7c3aed",
                    },
                });
            } else {
                // ✅ Simple while loop like old version - proven fast
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
                    selected: true,
                    selectedColor: "#7c3aed",
                };
                
                range[endStr] = {
                    endingDay: true,
                    color: "#b8a4ff",
                    textColor: "black",
                    selected: true,
                    selectedColor: "#7c3aed",
                };

                setSelectedDates(range);
            }
            
            setStartDate(startStr);
            setEndDate(endStr);
        }
    }, [startDate, endDate, minDate]);

    const parseTimeToDate = (dateStr: string, timeStr: string): Date => {
        const match = timeStr.match(/(\d+):(\d+)\s*(SA|CH)/);
        if (!match) {
            const date = new Date(dateStr);
            date.setHours(10, 0, 0, 0);
            return date;
        }

        let hour = parseInt(match[1]);
        const minute = parseInt(match[2]);
        const period = match[3];

        if (period === 'CH' && hour !== 12) {
            hour += 12;
        } else if (period === 'SA' && hour === 12) {
            hour = 0;
        }

        const date = new Date(dateStr);
        date.setHours(hour, minute, 0, 0);
        return date;
    };

    const validateBookingTime = (startDateStr: string, startTimeStr: string): boolean => {
        const selectedStartDateTime = parseTimeToDate(startDateStr, startTimeStr);
        const minAllowedTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        if (selectedStartDateTime < minAllowedTime) {
            setValidationError(
                `Bạn phải đặt trước ít nhất 24 giờ. Thời gian nhận xe phải sau ${minDateTime.toLocaleString('vi-VN', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}`
            );
            return false;
        }

        setValidationError(null);
        return true;
    };

    const handleConfirm = () => {
        if (startDate && endDate) {
            if (!validateBookingTime(startDate, pickupTime)) {
                return;
            }

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
            setValidationError(null);
        } else {
            setReturnTime(time);
        }
        setShowTimePicker(false);
    };

    // ✅ Direct mutation like old version - FAST but safe
    const markedDatesWithDisabled = useMemo(() => {
        const marked = { ...selectedDates };
        
        // Add today indicator
        if (!marked[todayStr]) {
            marked[todayStr] = {
                marked: true,
                dotColor: '#fbbf24',
                disabled: true,
                disableTouchEvent: true,
            };
        } else {
            marked[todayStr] = {
                ...marked[todayStr],
                marked: true,
                dotColor: '#fbbf24',
            };
        }
        
        // Disable past dates - simple loop like old version
        const disableDate = new Date(minDate);
        for (let i = 0; i < 60; i++) {
            disableDate.setDate(disableDate.getDate() - 1);
            const pastDateStr = formatLocalDate(disableDate);
            if (!marked[pastDateStr]) {
                marked[pastDateStr] = {
                    disabled: true,
                    disableTouchEvent: true,
                };
            }
        }
        
        return marked;
    }, [selectedDates, minDate, todayStr]);

    const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
        "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
        "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const renderMonth = useCallback(({ item }: { item: Date }) => (
        <MonthCalendar
            monthDate={item}
            monthNames={monthNames}
            markedDates={markedDatesWithDisabled}
            onDayPress={onDayPress}
            minDateStr={minDateStr}
        />
    ), [markedDatesWithDisabled, onDayPress, minDateStr, monthNames]);

    const keyExtractor = useCallback((item: Date, index: number) => `month-${index}`, []);

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
                                <View>
                                    <Text style={styles.headerTitle}>Xác Nhận Thời Gian Thuê</Text>
                                    {branchName && (
                                        <Text style={styles.branchInfo}>
                                            📍 {branchName}
                                        </Text>
                                    )}
                                    <Text style={styles.branchHours}>
                                        ⏰ Giờ mở cửa: {branchOpenTime} - {branchCloseTime}
                                    </Text>
                                    <Text style={styles.advanceBookingNotice}>
                                        ⚠️ Phải đặt trước ít nhất 24 giờ
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    onPress={onClose} 
                                    style={styles.closeButton}
                                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={28} color="#888" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.calendarContainer}>
                                {!calendarReady ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#b8a4ff" />
                                        <Text style={styles.loadingText}>Đang tải lịch...</Text>
                                    </View>
                                ) : (
                                    <View style={{ flex: 1, width: '100%' }}>
                                        <FlatList
                                            data={monthsToDisplay}
                                            renderItem={renderMonth}
                                            keyExtractor={keyExtractor}
                                            showsVerticalScrollIndicator={false}
                                            style={styles.scrollView}
                                            windowSize={31}
                                            initialNumToRender={4}
                                            maxToRenderPerBatch={2}
                                            removeClippedSubviews={false}
                                            onEndReached={loadMoreMonths}
                                            onEndReachedThreshold={0.5}
                                        />
                                    </View>
                                )}
                            </View>

                            <View style={styles.dateTimeOverlay}>
                                {validationError && (
                                    <View style={styles.errorBanner}>
                                        <Text style={styles.errorIcon}>⚠️</Text>
                                        <Text style={styles.errorText}>{validationError}</Text>
                                    </View>
                                )}
                                
                                <View style={styles.dateTimeContainer}>
                                    <View style={styles.dateTimeBox}>
                                        <Text style={styles.dateLabel}>Giờ Nhận</Text>
                                        <TouchableOpacity onPress={() => openTimePicker("pickup")}>
                                            <Text style={styles.timeLabel}>{pickupTime}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.dateTimeBox}>
                                        <Text style={styles.dateLabel}>Giờ Trả</Text>
                                        <TouchableOpacity onPress={() => openTimePicker("return")}>
                                            <Text style={styles.timeLabel}>{returnTime}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <PrimaryButton title="Xác Nhận" onPress={handleConfirm} />
                            </View>

                            {showTimePicker && (
                                <TimePickerModal
                                    onConfirm={handleTimeConfirm}
                                    onCancel={() => setShowTimePicker(false)}
                                    branchOpen={branchOpen}
                                    branchClose={branchClose}
                                    getAvailableHours={getAvailableHours}
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
    branchOpen: { hour: number; period: string };
    branchClose: { hour: number; period: string };
    getAvailableHours: (period: string) => number[];
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({ 
    onConfirm, 
    onCancel,
    branchOpen,
    branchClose,
    getAvailableHours,
}) => {
    const [selectedHour, setSelectedHour] = useState(branchOpen.hour);
    const [selectedPeriod, setSelectedPeriod] = useState(branchOpen.period);

    const periods = ["SA", "CH"];
    const availableHours = getAvailableHours(selectedPeriod);

    const ITEM_HEIGHT = 60;

    const handlePeriodChange = (newPeriod: string) => {
        setSelectedPeriod(newPeriod);
        const newAvailableHours = getAvailableHours(newPeriod);
        
        if (!newAvailableHours.includes(selectedHour)) {
            setSelectedHour(newAvailableHours[0] || 8);
        }
    };

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
                <Text style={styles.timePickerSubtitle}>
                    Chỉ giờ mở cửa chi nhánh
                </Text>
                
                <View style={styles.pickerWrapper}>
                    <View style={styles.selectionIndicator} />
                    
                    <View style={styles.pickerContainer}>
                        {renderPickerColumn(availableHours, selectedHour, setSelectedHour, 70)}
                        
                        <View style={styles.staticElementContainer}>
                            <Text style={styles.timeSeparator}>:</Text>
                        </View>
                        
                        <View style={styles.staticElementContainer}>
                            <Text style={styles.timeFixed}>00</Text>
                        </View>
                        
                        {renderPickerColumn(periods, selectedPeriod, handlePeriodChange, 90)}
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
        alignItems: "flex-start",
        marginBottom: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 4,
    },
    branchInfo: {
        color: "#b8a4ff",
        fontSize: 14,
        fontWeight: "500",
        marginTop: 4,
    },
    branchHours: {
        color: "#999",
        fontSize: 12,
        marginTop: 2,
    },
    advanceBookingNotice: {
        color: "#fbbf24",
        fontSize: 12,
        marginTop: 4,
        fontWeight: "600",
    },
    closeButton: {
        padding: 5,
    },
    calendarContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        height: "70%",
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    loadingText: {
        color: "#999",
        fontSize: 14,
        fontWeight: "500",
    },
    scrollView: {
        width: '100%',
    },
    monthWrapper: {
        marginBottom: 20,
        width: '100%',
    },
    monthHeader: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        paddingVertical: 10,
    },
    calendar: {
        width: '100%',
    },
    dateTimeOverlay: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "column",
        alignItems: "center",
    },
    errorBanner: {
        backgroundColor: "#7c2d12",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ea580c",
    },
    errorIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    errorText: {
        color: "#fed7aa",
        fontSize: 13,
        flex: 1,
        fontWeight: "500",
    },
    dateTimeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        width: "100%",
        gap: 10,
    },
    dateTimeBox: {
        flex: 1,
        backgroundColor: "#2a2a2a",
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        padding: 10,
        alignItems: "center",
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
        marginBottom: 6,
    },
    timePickerSubtitle: {
        color: "#999",
        fontSize: 13,
        marginBottom: 24,
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