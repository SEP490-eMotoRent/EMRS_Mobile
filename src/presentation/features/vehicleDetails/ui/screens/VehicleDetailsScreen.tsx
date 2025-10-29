// presentation/features/vehicleDetails/ui/VehicleDetailsScreen.tsx
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { 
    ActivityIndicator, 
    ScrollView, 
    StyleSheet, 
    View, 
    Text,
    TouchableOpacity 
} from "react-native";
import { BrowseStackParamList, HomeStackParamList } from "../../../../shared/navigation/StackParameters/types";

import { BookingButton } from "../atoms/buttons/BookingButton";
import { BackButton } from "../../../../common/components/atoms/buttons/BackButton";
import { ConditionSection } from "../organisms/ConditionSection";
import { ImageGallery } from "../organisms/ImageGallery";
import { PickupLocationSection } from "../organisms/PickupLocationSection";
import { PricingSection } from "../organisms/PricingSection";
import sl from "../../../../../core/di/InjectionContainer";
import { useVehicleDetail } from "../../hooks/useVehicleModelsDetails";
import { VehicleModelRemoteDataSource } from "../../../../../data/datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";

type RoutePropType = RouteProp<BrowseStackParamList, 'VehicleDetails'>;
type NavProp = StackNavigationProp<HomeStackParamList>;

export const VehicleDetailsScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavProp>();
    const { vehicleId } = route.params;

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const remote = useMemo(() =>
        sl.get<VehicleModelRemoteDataSource>("VehicleModelRemoteDataSource"), 
        []
    );
    
    const { data, loading, error } = useVehicleDetail(vehicleId, remote);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#a78bfa" />
            </View>
        );
    }

    if (!data || error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error || "Vehicle not found"}</Text>
            </View>
        );
    }

    const images = [data.imageUrl];

    const dailyPrice = data.pricePerDay;
    const pricingOptions = [
        { duration: "4 Hours", price: dailyPrice > 0 ? `${Math.round(dailyPrice * 0.3).toLocaleString()}đ` : "N/A" },
        { duration: "8 Hours", price: dailyPrice > 0 ? `${Math.round(dailyPrice * 0.5).toLocaleString()}đ` : "N/A" },
        { duration: "24 Hours", price: dailyPrice > 0 ? `${dailyPrice.toLocaleString()}đ` : "N/A" },
        { duration: "3+ Days", price: dailyPrice > 0 ? `${Math.round(dailyPrice * 0.85).toLocaleString()}đ/day` : "N/A" },
    ];

    const handleBooking = () => {
        navigation.navigate('Booking', {
            screen: 'ConfirmRentalDuration',
            params: { vehicleId }
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Back Button */}
                <BackButton 
                    onPress={() => navigation.goBack()} 
                    label="Back to List" 
                />

                <ImageGallery images={images} />

                {/* Vehicle Name */}
                <View style={styles.nameContainer}>
                    <Text style={styles.vehicleName}>{data.name}</Text>
                </View>

                {/* Specs Row */}
                <View style={styles.specsContainer}>
                    {data.battery && (
                        <View style={styles.specItem}>
                            <Text style={styles.specIcon}>🔋</Text>
                            <Text style={styles.specText}>{data.battery}</Text>
                        </View>
                    )}
                    {data.topSpeed && (
                        <View style={styles.specItem}>
                            <Text style={styles.specIcon}>⚡</Text>
                            <Text style={styles.specText}>{data.topSpeed}</Text>
                        </View>
                    )}
                    {data.range && (
                        <View style={styles.specItem}>
                            <Text style={styles.specIcon}>📍</Text>
                            <Text style={styles.specText}>{data.range}</Text>
                        </View>
                    )}
                </View>

                {/* Description with Show More */}
                {data.description && data.description !== "No description." && (
                    <View style={styles.descriptionContainer}>
                        <View style={styles.descriptionHeader}>
                            <Text style={styles.descriptionTitle}>About</Text>
                            <TouchableOpacity 
                                style={styles.showMoreButton}
                                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.showMoreText}>
                                    {isDescriptionExpanded ? "Show less" : "Show more"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text 
                            style={styles.descriptionText} 
                            numberOfLines={isDescriptionExpanded ? undefined : 3}
                        >
                            {data.description}
                        </Text>
                    </View>
                )}

                <PricingSection 
                    pricingOptions={pricingOptions} 
                    securityDeposit="2,000,000đ" 
                />

                <ConditionSection 
                    requirements={[
                        "Require Identification Card",
                        "Require Driving License",
                        "Customer must pay Security Deposit",
                    ]} 
                />

                <PickupLocationSection
                    address="6 Hoàng Văn Thụ, P2, Tân Bình"
                    branchName="District 2 eMotoRent Branch"
                    branchAddress="6 Hoàng Văn Thụ, District 2, Tân Bình"
                    phone="+84 123 456 789"
                    mapImageUri="https://via.placeholder.com/400x200/1a1a1a/a78bfa?text=Map+View"
                />
            </ScrollView>

            <BookingButton onPress={handleBooking} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#000" 
    },
    scrollView: { 
        flex: 1 
    },
    content: { 
        padding: 16, 
        paddingBottom: 100 
    },
    center: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#000",
    },
    error: { 
        color: "#FF4444", 
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 32,
    },
    nameContainer: {
        backgroundColor: "#1a1a1a",
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 16,
    },
    vehicleName: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },
    specsContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    specItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        gap: 6,
    },
    specIcon: {
        fontSize: 16,
    },
    specText: {
        color: "#d1d5db",
        fontSize: 12,
        fontWeight: "600",
    },
    descriptionContainer: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    descriptionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    descriptionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    showMoreButton: {
        backgroundColor: "#a78bfa",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    showMoreText: {
        color: "#000",
        fontSize: 12,
        fontWeight: "700",
    },
    descriptionText: {
        color: "#9ca3af",
        fontSize: 14,
        lineHeight: 20,
    },
});