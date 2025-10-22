import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../../../../../common/theme/colors';
import { AntDesign } from '@expo/vector-icons';
import { ScreenHeader } from '../../../../../common/components/organisms/ScreenHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StaffStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { StackNavigationProp } from '@react-navigation/stack';

type MotorbikeDetailScreenNavigationProp = StackNavigationProp<StaffStackParamList, 'Home'>;

interface MotorbikeDetail {
  id: string;
  name: string;
  plate: string;
  batteryLevel: number;
  range: number;
  status: 'available' | 'rented' | 'charging' | 'maintenance';
  location: string;
  lastCharged: string;
  images: any[];
  condition: string[];
  rentalPricing: {
    hours4: number;
    hours8: number;
    hours24: number;
    longTerm: number;
    securityDeposit: number;
  };
  branchInfo: {
    name: string;
    address: string;
    phone: string;
    distance: string;
    hours: string;
    status: 'available' | 'busy';
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

export const MotorbikeDetailScreen: React.FC = () => {
  const navigation = useNavigation<MotorbikeDetailScreenNavigationProp>();
  const route = useRoute();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  // Mock data - in real app, this would come from route params
  const motorbike: MotorbikeDetail = {
    id: '1',
    name: 'VinFast Evo200',
    plate: '59X1-12345',
    batteryLevel: 85,
    range: 180,
    status: 'available',
    location: 'Bay A-01',
    lastCharged: '2 hours ago',
    images: [
      require('../../../../../../../assets/images/motor.png'),
      require('../../../../../../../assets/images/motor.png'),
      require('../../../../../../../assets/images/motor.png'),
    ],
    condition: [
      'Require Identification Card',
      'Require Driving License',
      'Customer must pay Depositing Fee',
      'Customer must Book Online',
    ],
    rentalPricing: {
      hours4: 70000,
      hours8: 120000,
      hours24: 150000,
      longTerm: 135000,
      securityDeposit: 2000000,
    },
    branchInfo: {
      name: 'District 2 eMotoRent Branch',
      address: '6 Hoàng Vân, District 2, Tân Bình',
      phone: '+84 123 456 789',
      distance: '2.5 km away',
      hours: 'Open 24/7',
      status: 'available',
      coordinates: {
        latitude: 10.7769,
        longitude: 106.7009,
      },
    },
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#67D16C';
      case 'rented': return '#FFB300';
      case 'charging': return '#C9B6FF';
      case 'maintenance': return '#FF6B6B';
      default: return colors.text.secondary;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 70) return '#67D16C';
    if (level >= 40) return '#FFB300';
    return '#FF6B6B';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Motorbike Details"
          subtitle={motorbike.plate}
          onBack={() => navigation.goBack()}
        />

        {/* Breadcrumbs */}
        <View style={styles.breadcrumbs}>
          <Text style={styles.breadcrumbText}>Home</Text>
          <AntDesign name="right" size={12} color={colors.text.secondary} />
          <Text style={styles.breadcrumbText}>Search Results</Text>
          <AntDesign name="right" size={12} color={colors.text.secondary} />
          <Text style={styles.breadcrumbText}>{motorbike.name}</Text>
        </View>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={motorbike.images[selectedImageIndex]} style={styles.mainImage} />
        </View>

        {/* Thumbnail Gallery */}
        <View style={styles.thumbnailContainer}>
          {motorbike.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.thumbnail,
                selectedImageIndex === index && styles.thumbnailSelected,
              ]}
              onPress={() => setSelectedImageIndex(index)}
            >
              <Image source={image} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Motorbike Name and Show More */}
        <View style={styles.nameCard}>
          <Text style={styles.motorbikeName}>{motorbike.name}</Text>
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setShowMore(!showMore)}
          >
            <Text style={styles.showMoreText}>Show more</Text>
          </TouchableOpacity>
        </View>

        {/* Condition Section */}
        <View style={styles.conditionCard}>
          <Text style={styles.sectionTitle}>Condition</Text>
          <Text style={styles.requirementLabel}>Requirement</Text>
          {motorbike.condition.map((item, index) => (
            <View key={index} style={styles.conditionItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.conditionText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Rental Pricing Section */}
        <View style={styles.pricingCard}>
          <Text style={styles.sectionTitle}>Rental Pricing (VND)</Text>
          <View style={styles.pricingGrid}>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingDuration}>4 Hours</Text>
              <Text style={styles.pricingAmount}>{formatPrice(motorbike.rentalPricing.hours4)}</Text>
            </View>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingDuration}>8 Hours</Text>
              <Text style={styles.pricingAmount}>{formatPrice(motorbike.rentalPricing.hours8)}</Text>
            </View>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingDuration}>24 Hours</Text>
              <Text style={styles.pricingAmount}>{formatPrice(motorbike.rentalPricing.hours24)}</Text>
            </View>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingDuration}>Long-term (10+ days)</Text>
              <Text style={styles.pricingAmount}>From {formatPrice(motorbike.rentalPricing.longTerm)}/day</Text>
            </View>
          </View>
          <View style={styles.securityDepositItem}>
            <Text style={styles.pricingDuration}>Security Deposit</Text>
            <Text style={styles.pricingAmount}>{formatPrice(motorbike.rentalPricing.securityDeposit)}</Text>
          </View>
        </View>

        {/* Pick-Up Location Section */}
        <View style={styles.locationCard}>
          <Text style={styles.sectionTitle}>Pick-Up Location</Text>
          
          {/* Location Dropdown */}
          <View style={styles.locationDropdown}>
            <Text style={styles.locationText}>{motorbike.branchInfo.address}</Text>
            <AntDesign name="down" size={16} color={colors.text.secondary} />
          </View>

          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: motorbike.branchInfo.coordinates.latitude,
                longitude: motorbike.branchInfo.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              mapType="standard"
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              <Marker
                coordinate={motorbike.branchInfo.coordinates}
                title="VINFAST DONG SÀI GÒN CH"
                description={motorbike.branchInfo.address}
              >
                <View style={styles.customMarker}>
                  <AntDesign name="environment" size={16} color="#FF0000" />
                </View>
              </Marker>
            </MapView>
          </View>

          {/* Branch Details */}
          <View style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <Text style={styles.branchName}>{motorbike.branchInfo.name}</Text>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{motorbike.branchInfo.distance}</Text>
              </View>
            </View>
            
            <View style={styles.branchDetails}>
              <View style={styles.branchDetailItem}>
                <AntDesign name="environment" size={14} color={colors.text.secondary} />
                <Text style={styles.branchDetailText}>{motorbike.branchInfo.address}</Text>
              </View>
              <View style={styles.branchDetailItem}>
                <AntDesign name="clock-circle" size={14} color={colors.text.secondary} />
                <Text style={styles.branchDetailText}>{motorbike.branchInfo.hours}</Text>
              </View>
              <View style={styles.branchDetailItem}>
                <AntDesign name="phone" size={14} color={colors.text.secondary} />
                <Text style={styles.branchDetailText}>{motorbike.branchInfo.phone}</Text>
              </View>
            </View>

            <TouchableOpacity style={[
              styles.availabilityButton,
              motorbike.branchInfo.status === 'available' ? styles.availableButton : styles.busyButton
            ]}>
              <Text style={[
                styles.availabilityButtonText,
                motorbike.branchInfo.status === 'available' ? styles.availableButtonText : styles.busyButtonText
              ]}>
                {motorbike.branchInfo.status === 'available' ? 'Available now' : 'Currently busy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  breadcrumbText: {
    color: colors.text.primary,
    fontSize: 12,
  },
  imageContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mainImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailSelected: {
    borderColor: '#C9B6FF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nameCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  motorbikeName: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  showMoreButton: {
    backgroundColor: '#C9B6FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  showMoreText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  conditionCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  requirementLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 8,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C9B6FF',
  },
  conditionText: {
    color: colors.text.primary,
    fontSize: 12,
    flex: 1,
  },
  pricingCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pricingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  pricingItem: {
    width: '48%',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  securityDepositItem: {
    width: '100%',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  pricingDuration: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 4,
  },
  pricingAmount: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  locationCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  locationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  locationText: {
    color: colors.text.primary,
    fontSize: 14,
    flex: 1,
  },
  mapContainer: {
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  branchCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
  },
  branchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  branchName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: '#3A3A3A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  distanceText: {
    color: colors.text.secondary,
    fontSize: 10,
  },
  branchDetails: {
    marginBottom: 12,
  },
  branchDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  branchDetailText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  availabilityButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  availableButton: {
    backgroundColor: '#67D16C',
  },
  busyButton: {
    backgroundColor: '#FF6B6B',
  },
  availabilityButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableButtonText: {
    color: '#000',
  },
  busyButtonText: {
    color: '#FFFFFF',
  },
});
