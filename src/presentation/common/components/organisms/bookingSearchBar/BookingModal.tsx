import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useBranches } from "../../../../features/map/hooks/useBranches";
import { HomeStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";
import { CityCard } from "../../molecules/cards/CityCard";
import { InputField } from "../../molecules/InputField";
import { DateTimeSearchModal } from "./DateTimeSearchModal";

type NavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
    initialAddress?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
    visible, 
    onClose, 
    initialAddress 
}) => {
    const navigation = useNavigation<NavigationProp>();
    const { branches, loading, error } = useBranches();
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const [address, setAddress] = useState("1 Phạm Văn Hai, Tân Bình");
    const [selectedDates, setSelectedDates] = useState<string | null>(null);

    useEffect(() => {
        if (visible && initialAddress) {
            setAddress(initialAddress);
        }
    }, [visible, initialAddress]);

    const handleConfirmDates = (range: string) => {
        setSelectedDates(range);
        setDateModalVisible(false);
    };

    const handleBranchSelect = (branchName: string, branchAddress: string) => {
        setAddress(branchAddress);
    };

    const handleGetCurrentLocation = async () => {
        setLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Quyền truy cập bị từ chối',
                    'Vui lòng cho phép truy cập vị trí để sử dụng tính năng này.',
                    [{ text: 'OK' }]
                );
                setLoadingLocation(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const [geocode] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (geocode) {
                const formattedAddress = [
                    geocode.street,
                    geocode.district,
                    geocode.city,
                ].filter(Boolean).join(', ');

                setAddress(formattedAddress || 'Vị trí hiện tại');
            } else {
                setAddress(`${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
            }
        } catch (error) {
            Alert.alert(
                'Lỗi',
                'Không thể lấy vị trí hiện tại. Vui lòng thử lại.',
                [{ text: 'OK' }]
            );
            console.error('Error getting location:', error);
        } finally {
            setLoadingLocation(false);
        }
    };

    const formatDateRange = (range: string | null) => {
        if (!range) return null;
        
        const parts = range.match(/(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2}) \((.+?) - (.+?)\)/);
        if (!parts) return null;

        const [_, startDate, endDate, startTime, endTime] = parts;
        
        const formatDate = (dateStr: string) => {
            const date = new Date(dateStr);
            const months = ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
                            "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"];
            return `${date.getDate()} ${months[date.getMonth()]}`;
        };

        const convertTime = (time: string) => {
            if (time.includes("SA") || time.includes("CH")) {
                return time;
            }
            return time.replace("PM", "CH").replace("AM", "SA");
        };

        return {
            start: formatDate(startDate),
            end: formatDate(endDate),
            startTime: convertTime(startTime),
            endTime: convertTime(endTime)
        };
    };

    const formatDateRangeForDisplay = (range: string | null) => {
        if (!range) return "Chọn Ngày";
        
        const formatted = formatDateRange(range);
        if (!formatted) return "Chọn Ngày";
        
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
                    <View style={styles.header}>
                        <View style={styles.dragHandle} />
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={onClose}
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={28} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>Ở ĐÂU VÀ KHI NÀO</Text>

                    {/* Address Input - wrapped icon with spacing */}
                    <InputField 
                        icon={
                            <View style={{ marginRight: 12 }}>
                                <Ionicons name="business" size={26} color="#A78BFA" />
                            </View>
                        }
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Điền địa chỉ của bạn hoặc chi nhánh"
                    />

                    {/* Date Range - bigger icons */}
                    <TouchableOpacity
                        style={styles.dateBox}
                        onPress={() => setDateModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="calendar-outline" size={26} color="#A78BFA" />
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
                        <Ionicons name="chevron-forward" size={26} color="#555" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.branchHeader}>
                        <Text style={styles.sectionTitle}>Chi Nhánh</Text>
                        <Text style={styles.branchCount}>
                            {branches.length > 0 ? `${branches.length} chi nhánh` : ''}
                        </Text>
                    </View>

                    {/* GPS button - bigger icon */}
                    <TouchableOpacity
                        style={styles.gpsButton}
                        onPress={handleGetCurrentLocation}
                        disabled={loadingLocation}
                        activeOpacity={0.7}
                    >
                        {loadingLocation ? (
                            <ActivityIndicator size="small" color="#A78BFA" />
                        ) : (
                            <Ionicons name="locate" size={26} color="#A78BFA" />
                        )}
                        <Text style={styles.gpsText}>
                            {loadingLocation ? 'Đang lấy vị trí...' : 'Sử dụng vị trí hiện tại'}
                        </Text>
                    </TouchableOpacity>
                    
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#A78BFA" />
                            <Text style={styles.loadingText}>Đang tải chi nhánh...</Text>
                        </View>
                    )}

                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="warning" size={22} color="#ff6b6b" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {!loading && !error && branches.map((branch) => (
                        <CityCard
                            key={branch.id}
                            cityName={branch.branchName}
                            state={branch.address}
                            onPress={() => handleBranchSelect(branch.branchName, branch.address)}
                        />
                    ))}

                    {!loading && !error && branches.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="business-outline" size={48} color="#333" />
                            <Text style={styles.emptyText}>Không có chi nhánh</Text>
                        </View>
                    )}

                    <View style={{ marginVertical: 20 }}>
                        <PrimaryButton title="Tìm Kiếm" onPress={handleSearch} />
                    </View>
                    </ScrollView>
                </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Modal>

        <DateTimeSearchModal
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
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
        position: 'relative',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 8,
        padding: 8,
        zIndex: 10,
    },
    sectionTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
        marginTop: 12,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    gpsButton: {
        backgroundColor: '#0a0a0a',
        borderRadius: 10,
        padding: 14,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    gpsText: {
        color: '#A78BFA',
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 12,
    },
    dateBox: {
        backgroundColor: '#0a0a0a',
        borderRadius: 10,
        padding: 14,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    dateContent: {
        flex: 1,
        marginLeft: 16, // ✅ Increased spacing
    },
    inputLabel: {
        color: "#aaa",
        fontSize: 15,
    },
    dateFromLabel: {
        color: "#888",
        fontSize: 12,
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    dateText: {
        color: "#fff",
        fontSize: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#1a1a1a',
        marginVertical: 16,
    },
    branchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    branchCount: {
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
    },
    loadingText: {
        color: '#888',
        marginLeft: 10,
        fontSize: 14,
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#1a0a0a',
        borderRadius: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#2a0a0a',
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        flex: 1,
        marginLeft: 10,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        marginTop: 12,
    },
});