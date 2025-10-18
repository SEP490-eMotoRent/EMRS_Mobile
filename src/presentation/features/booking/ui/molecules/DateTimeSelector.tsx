import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DateTimeModal } from "../../../../common/components/organisms/bookingSearchBar/DateTimeModal";

interface DateTimeSelectorProps {
    startDate: string;
    endDate: string;
    onDateRangeChange: (dateRange: string) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
    startDate,
    endDate,
    onDateRangeChange,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleConfirm = (dateRange: string) => {
        onDateRangeChange(dateRange);
        setModalVisible(false);
    };

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.dateBox} 
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.label}>From</Text>
                    <Text style={styles.value}>{startDate}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.dateBox} 
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.label}>To</Text>
                    <Text style={styles.value}>{endDate}</Text>
                </TouchableOpacity>
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
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    dateBox: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    label: {
        color: "#999",
        fontSize: 12,
        marginBottom: 6,
    },
    value: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});
