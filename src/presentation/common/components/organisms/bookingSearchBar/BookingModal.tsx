import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
} from "react-native";
import { BrowseStackParamList, HomeStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";
import { BuildingIcon } from "../../atoms/icons/searchBarIcons/BuildingIcon";
import { CalendarIcon } from "../../atoms/icons/searchBarIcons/CalendarIcon";
import { CityCard } from "../../molecules/cards/CityCard";
import { InputField } from "../../molecules/InputField";
import { DateTimeModal } from "./DateTimeModal";
import { useBranches } from "../../../../features/map/hooks/useBranches";

type NavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ visible, onClose }) => {
    const navigation = useNavigation<NavigationProp>();
    const { branches, loading, error } = useBranches();
    const [dateModalVisible, setDateModalVisible] = useState(false);

    const [address, setAddress] = useState("1 Phạm Văn Hai, Street, Tân Bình...");
    const [selectedDates, setSelectedDates] = useState<string | null>(null);

    const handleConfirmDates = (range: string) => {
        setSelectedDates(range);
        setDateModalVisible(false);
    };

    const handleBranchSelect = (branchName: string, branchAddress: string) => {
        setAddress(`${branchName}, ${branchAddress}`);
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
        onClose();
        
        navigation.navigate('Browse', {
            screen: 'Map',
            params: {
                location: address,
                dateRange: formatDateRangeForDisplay(selectedDates),
                address: address,
            }
        });
    };

    const formattedDates = formatDateRange(selectedDates);

    return (
        <>
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback>
                <View style={styles.sheet}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>Ở ĐÂU VÀ KHI NÀO</Text>

                    {/* Address Input */}
                    <InputField 
                        icon={<BuildingIcon />}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Điền Địa Chỉ của bạn hoặc chi nhánh"
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
                                    <Text style={styles.dateFromLabel}>Từ</Text>
                                    <Text style={styles.dateText}>
                                        {formattedDates.start} | {formattedDates.startTime} - {formattedDates.end} | {formattedDates.endTime}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.inputLabel}>Chọn Ngày</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Chi Nhánh</Text>
                    
                    {/* Loading State */}
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#A78BFA" />
                            <Text style={styles.loadingText}>Đang tải...</Text>
                        </View>
                    )}

                    {/* Error State */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Branches List */}
                    {!loading && !error && branches.map((branch) => (
                        <CityCard
                            key={branch.id}
                            cityName={branch.branchName}
                            state={branch.address}
                            onPress={() => handleBranchSelect(branch.branchName, branch.address)}
                        />
                    ))}

                    {/* Empty State */}
                    {!loading && !error && branches.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không có chi nhánh</Text>
                        </View>
                    )}

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
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        color: '#888',
        marginLeft: 10,
        fontSize: 14,
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#2a0a0a',
        borderRadius: 10,
        marginVertical: 8,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        textAlign: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 14,
    },
});