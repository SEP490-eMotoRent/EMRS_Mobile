import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";
import { DateTimeModal } from "./DateTimeModal";
import { CalendarIcon } from "../../atoms/icons/searchBarIcons/CalendarIcon";
import { BuildingIcon } from "../../atoms/icons/searchBarIcons/BuildingIcon";
import { CityCard } from "../../molecules/cards/CityCard";
import { InputField } from "../../molecules/InputField";
import { HomeStackParamList } from "../../../../shared/navigation/StackParameters/types";

type NavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ visible, onClose }) => {
    const navigation = useNavigation<NavigationProp>();
    const [dateModalVisible, setDateModalVisible] = useState(false);

    const [address, setAddress] = useState("1 Phạm Văn Hai, Street, Tân Bình...");
    const [selectedDates, setSelectedDates] = useState<string | null>(null);

    const handleConfirmDates = (range: string) => {
        setSelectedDates(range);
        setDateModalVisible(false);
    };

    const handleCitySelect = (cityName: string, state: string) => {
        setAddress(`${cityName}, ${state}`);
    };

    const formatDateRange = (range: string | null) => {
        if (!range) return null;
        
        // Parse the range format: "2025-10-21 - 2025-10-31 (6:00 PM - 10:00 AM)"
        const parts = range.match(/(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2}) \((.+) - (.+)\)/);
        if (!parts) return null;

        const [_, startDate, endDate, startTime, endTime] = parts;
        
        const formatDate = (dateStr: string) => {
            const date = new Date(dateStr);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${months[date.getMonth()]} ${date.getDate()}`;
        };

        return {
            start: formatDate(startDate),
            end: formatDate(endDate),
            startTime,
            endTime
        };
    };

    const formatDateRangeForDisplay = (range: string | null) => {
        if (!range) return "Select dates";
        
        const formatted = formatDateRange(range);
        if (!formatted) return "Select dates";
        
        return `${formatted.start} | ${formatted.startTime} - ${formatted.end} | ${formatted.endTime}`;
    };

    const handleSearch = () => {
        // Navigate to Map screen with search parameters
        onClose();
        navigation.navigate('Map', {
            location: address,
            dateRange: formatDateRangeForDisplay(selectedDates),
            address: address,
        });
    };

    const formattedDates = formatDateRange(selectedDates);

    const popularCities = [
        { name: "Quận 1", state: "Hồ Chí Minh, Việt Nam" },
        { name: "Quận 3", state: "Hồ Chí Minh, Việt Nam" },
        { name: "Quận 10", state: "Hồ Chí Minh, Việt Nam" },
        { name: "Tân Bình", state: "Hồ Chí Minh, Việt Nam" },
        { name: "Bình Thạnh", state: "Hồ Chí Minh, Việt Nam" }
    ];

    return (
        <>
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback>
                <View style={styles.sheet}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>Where & When</Text>

                    {/* Address Input */}
                    <InputField 
                        icon={<BuildingIcon />}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Enter address"
                    />

                    {/* Date Range */}
                    <TouchableOpacity
                        style={styles.dateBox}
                        onPress={() => setDateModalVisible(true)}
                    >
                        <CalendarIcon />
                        <View style={styles.dateContent}>
                            {formattedDates ? (
                                <>
                                    <Text style={styles.dateFromLabel}>From</Text>
                                    <Text style={styles.dateText}>
                                        {formattedDates.start} | {formattedDates.startTime} - {formattedDates.end} | {formattedDates.endTime}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.inputLabel}>Select Dates</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Popular Districts</Text>
                    {popularCities.map((city, i) => (
                        <CityCard
                            key={i}
                            cityName={city.name}
                            state={city.state}
                            onPress={() => handleCitySelect(city.name, city.state)}
                        />
                    ))}

                    <View style={{ marginVertical: 20 }}>
                        <PrimaryButton title="Search" onPress={handleSearch} />
                    </View>
                    </ScrollView>
                </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Modal>

        {/* Date/Time modal */}
        <DateTimeModal
            visible={dateModalVisible}
            onClose={() => setDateModalVisible(false)}
            onConfirm={handleConfirmDates}
        />
        </>
    );
};

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
        padding: 16,
    },
    sectionTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
        marginTop: 12,
        marginBottom: 8,
    },
    dateBox: {
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 14,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateContent: {
        flex: 1,
    },
    inputLabel: {
        color: "#fff",
        fontSize: 15,
    },
    dateFromLabel: {
        color: "#fff",
        fontSize: 13,
        marginBottom: 2,
    },
    dateText: {
        color: "#fff",
        fontSize: 15,
    },
});