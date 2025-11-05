// src/features/auth/components/molecules/DateOfBirthPicker.tsx
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

interface DateOfBirthPickerProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (date: string) => void;
    selectedDate?: string;
}

export const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
    visible,
    onClose,
    onConfirm,
    selectedDate,
}) => {
    const [tempDate, setTempDate] = useState<string | undefined>(selectedDate);

    // Calculate max date (must be at least 16 years old)
    const getMaxDate = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 16);
        return date.toISOString().split('T')[0];
    };

    // Calculate min date (reasonable oldest age: 100 years)
    const getMinDate = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 100);
        return date.toISOString().split('T')[0];
    };

    const handleDayPress = (day: any) => {
        setTempDate(day.dateString);
    };

    const handleConfirm = () => {
        if (tempDate) {
            onConfirm(tempDate);
            onClose();
        }
    };

    const formatDateDisplay = (dateStr: string | undefined) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];        
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const markedDates = tempDate
        ? {
                [tempDate]: {
                    selected: true,
                    selectedColor: '#b8a4ff',
                    selectedTextColor: '#000',
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
                                <Text style={styles.headerTitle}>Chọn ngày sinh</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Text style={styles.closeIcon}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.subtitle}>Bạn phải từ 16 tuổi trở lên</Text>

                            {/* Calendar */}
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    markedDates={markedDates}
                                    onDayPress={handleDayPress}
                                    maxDate={getMaxDate()}
                                    minDate={getMinDate()}
                                    theme={{
                                        calendarBackground: '#000',
                                        dayTextColor: '#fff',
                                        monthTextColor: '#fff',
                                        arrowColor: '#b8a4ff',
                                        textDisabledColor: '#444',
                                        todayTextColor: '#b8a4ff',
                                        selectedDayBackgroundColor: '#b8a4ff',
                                        selectedDayTextColor: '#000',
                                    }}
                                    style={styles.calendar}
                                />
                            </View>

                            {/* Selected Date Display */}
                            {tempDate && (
                                <View style={styles.selectedDateContainer}>
                                    <Text style={styles.selectedLabel}>Đã chọn:</Text>
                                    <Text style={styles.selectedDate}>
                                        {formatDateDisplay(tempDate)}
                                    </Text>
                                </View>
                            )}

                            {/* Action Buttons */}
                            <View style={styles.actions}>
                                <TouchableOpacity 
                                    style={styles.cancelButton} 
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelText}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.confirmButton,
                                        !tempDate && styles.confirmButtonDisabled,
                                    ]}
                                    onPress={handleConfirm}
                                    disabled={!tempDate}
                                >
                                    <Text style={styles.confirmText}>Xác Nhận</Text>
                                </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    sheet: {
        height: '75%',
        backgroundColor: '#000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    closeButton: {
        padding: 5,
    },
    closeIcon: {
        color: '#fff',
        fontSize: 24,
    },
    subtitle: {
        color: '#888',
        fontSize: 14,
        marginBottom: 20,
    },
    calendarContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    calendar: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedDateContainer: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 5,
    },
    selectedDate: {
        color: '#b8a4ff',
        fontSize: 18,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#fff',
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        padding: 16,
        borderRadius: 28,
        backgroundColor: '#b8a4ff',
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#444',
        opacity: 0.5,
    },
    confirmText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});