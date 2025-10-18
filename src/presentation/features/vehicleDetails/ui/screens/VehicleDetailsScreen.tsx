import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { HomeStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { BookingButton } from "../atoms/buttons/BookingButton";
import { ConditionSection } from "../organisms/ConditionSection";
import { ImageGallery } from "../organisms/ImageGallery";
import { PickupLocationSection } from "../organisms/PickupLocationSection";
import { PricingSection } from "../organisms/PricingSection";
import { VehicleHeader } from "../organisms/VehicleHeader";

type VehicleDetailsRouteProp = RouteProp<HomeStackParamList, 'VehicleDetails'>;
type VehicleDetailsNavigationProp = StackNavigationProp<HomeStackParamList, 'VehicleDetails'>;

export const VehicleDetailsScreen: React.FC = () => {
    const route = useRoute<VehicleDetailsRouteProp>();
    const navigation = useNavigation<VehicleDetailsNavigationProp>();
    const { vehicleId } = route.params;

    // TODO: Fetch vehicle data based on vehicleId from API
    console.log("Vehicle ID:", vehicleId);

    // Mock data
    const vehicleImages = [
        "https://via.placeholder.com/800x500/FFD700/000000?text=VinFast+Main",
        "https://via.placeholder.com/800x500/FFD700/000000?text=View+1",
        "https://via.placeholder.com/800x500/FFD700/000000?text=View+2",
        "https://via.placeholder.com/800x500/FFD700/000000?text=View+3",
        "https://via.placeholder.com/800x500/FFD700/000000?text=View+4",
    ];

    const requirements = [
        "Require Identification Card",
        "Require Driving License",
        "Customer must pay Depositing Fee",
        "Customer must Book Online",
    ];

    const pricingOptions = [
        { duration: "4 Hours", price: "70,000đ" },
        { duration: "8 Hours", price: "120,000đ" },
        { duration: "24 Hours", price: "150,000đ" },
        { duration: "Long-term (10+ days)", price: "From 135,000đ/day" },
    ];

    const handleShowMore = () => {
        console.log("Show more details");
        // TODO: Navigate to full specs page or expand inline
    };

    const handleBooking = () => {
        console.log("Proceed to booking for vehicle:", vehicleId);
        navigation.navigate('ConfirmRentalDuration', { vehicleId });
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Image Gallery */}
                <ImageGallery images={vehicleImages} />

                {/* Vehicle Header */}
                <VehicleHeader name="Vinfast Evo 200" onShowMore={handleShowMore} />

                {/* Condition Section */}
                <ConditionSection requirements={requirements} />

                {/* Pricing Section */}
                <PricingSection 
                    pricingOptions={pricingOptions}
                    securityDeposit="2,000,000đ"
                />

                {/* Pick-Up Location */}
                <PickupLocationSection
                    address="6 Hoàng Văn Thụ, P2, Tân Bình"
                    branchName="District 2 eMotoRent Branch"
                    branchAddress="6 Hoàng Văn..., District 2, Tân Bình"
                    phone="+84 123 456 789"
                    mapImageUri="https://via.placeholder.com/400x200/4169E1/ffffff?text=Map+View"
                />
            </ScrollView>

            {/* Booking Button */}
            <BookingButton onPress={handleBooking} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 24,
    },
});