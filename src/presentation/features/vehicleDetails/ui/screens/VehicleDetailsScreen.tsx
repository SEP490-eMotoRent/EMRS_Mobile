// presentation/features/vehicleDetails/ui/VehicleDetailsScreen.tsx
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React ,{ useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View, Text } from "react-native";
import { BrowseStackParamList, HomeStackParamList } from "../../../../shared/navigation/StackParameters/types";

import { BookingButton } from "../atoms/buttons/BookingButton";
import { ConditionSection } from "../organisms/ConditionSection";
import { ImageGallery } from "../organisms/ImageGallery";
import { PickupLocationSection } from "../organisms/PickupLocationSection";
import { PricingSection } from "../organisms/PricingSection";
import { VehicleHeader } from "../organisms/VehicleHeader";
import sl from "../../../../../core/di/InjectionContainer";
import { useVehicleDetail } from "../../hooks/useVehicleModelsDetails";
import { VehicleModelRemoteDataSource } from "../../../../../data/datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";

type RoutePropType = RouteProp<BrowseStackParamList, 'VehicleDetails'>;
type NavProp = StackNavigationProp<HomeStackParamList>;

export const VehicleDetailsScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavProp>();
    const { vehicleId } = route.params;

    // ✅ Memoize the remote instance so it doesn't change on every render
    const remote = useMemo(() =>
        sl.get<VehicleModelRemoteDataSource>("VehicleModelRemoteDataSource"), 
        []
    );
    
    const { data, loading, error } = useVehicleDetail(vehicleId, remote);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4169E1" />
            </View>
        );
    }

    if (!data || error) {  // ✅ Also check for error
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error || "Vehicle not found"}</Text>
            </View>
        );
    }

    const images = [data.imageUrl, ...Array(4).fill(data.imageUrl)];
    const price = data.pricePerDay; // number

    const pricingOptions = [
        { duration: "4 Hours", price: `${Math.round(price * 0.4)}đ` },
        { duration: "8 Hours", price: `${Math.round(price * 0.8)}đ` },
        { duration: "24 Hours", price: `${price}đ` },
        { duration: "Long-term (10+ days)", price: `From ${Math.round(price * 0.9)}đ/day` },
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
            <ImageGallery images={images} />
            <VehicleHeader name={data.name} onShowMore={() => {}} />

            <View style={styles.specs}>
            {data.range && <Text style={styles.spec}>lightning {data.range}</Text>}
            {data.battery && <Text style={styles.spec}>battery {data.battery}</Text>}
            {data.topSpeed && <Text style={styles.spec}>speed {data.topSpeed}</Text>}
            </View>

            <ConditionSection requirements={[
            "Require Identification Card",
            "Require Driving License",
            "Customer must pay Depositing Fee",
            "Customer must Book Online",
            ]} />

            <PricingSection pricingOptions={pricingOptions} securityDeposit="2,000,000đ" />

            <PickupLocationSection
            address="6 Hoàng Văn Thụ, P2, Tân Bình"
            branchName="District 2 eMotoRent Branch"
            branchAddress="6 Hoàng Văn..., District 2, Tân Bình"
            phone="+84 123 456 789"
            mapImageUri="https://via.placeholder.com/400x200/4169E1/ffffff?text=Map+View"
            />
        </ScrollView>

        <BookingButton onPress={handleBooking} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    scrollView: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    error: { color: "#FF4444", fontSize: 16 },
    specs: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginVertical: 16 },
    spec: { color: "#fff", backgroundColor: "#1a1a1a", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, fontSize: 14 },
});