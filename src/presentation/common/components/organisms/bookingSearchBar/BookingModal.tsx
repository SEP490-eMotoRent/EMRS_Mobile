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
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";
import { DateTimeModal } from "./DateTimeModal";

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ visible, onClose }) => {
    const [dateModalVisible, setDateModalVisible] = useState(false);

    const [address] = useState("1 Phạm Văn Hai, Street, Tân Bình...");
    const [selectedDates, setSelectedDates] = useState<string | null>(null);

    const handleConfirmDates = (range: string) => {
        setSelectedDates(range);
        setDateModalVisible(false);
    };

    return (
        <>
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback>
                <View style={styles.sheet}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>Where & When</Text>

                    {/* Address */}
                    <TouchableOpacity style={styles.inputBox}>
                        <Text style={styles.inputLabel}>{address}</Text>
                    </TouchableOpacity>

                    {/* Date Range */}
                    <TouchableOpacity
                        style={styles.inputBox}
                        onPress={() => setDateModalVisible(true)}
                    >
                        <Text style={styles.inputLabel}>
                        {selectedDates ?? "Select Dates"}
                        </Text>
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Popular Cities</Text>
                    {["New York City", "Los Angeles", "Austin", "Atlanta", "San Francisco"].map(
                        (city, i) => (
                        <TouchableOpacity key={i} style={styles.cityBox}>
                            <Text style={styles.cityName}>{city}</Text>
                            <Text style={styles.citySub}>
                            {city === "Austin"
                                ? "Texas, USA"
                                : city === "Atlanta"
                                ? "Georgia, USA"
                                : "California, USA"}
                            </Text>
                        </TouchableOpacity>
                        )
                    )}

                    <View style={{ marginVertical: 20 }}>
                        <PrimaryButton onPress={onClose}>Search</PrimaryButton>
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
    inputBox: {
        backgroundColor: "#111",
        borderRadius: 10,
        padding: 14,
        marginVertical: 6,
    },
    inputLabel: {
        color: "#fff",
        fontSize: 15,
    },
    cityBox: {
        backgroundColor: "#111",
        borderRadius: 10,
        padding: 14,
        marginVertical: 6,
    },
    cityName: {
        color: "#fff",
        fontWeight: "600",
    },
    citySub: {
        color: "#aaa",
        fontSize: 13,
    },
});
