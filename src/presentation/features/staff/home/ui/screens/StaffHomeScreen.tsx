import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import { colors } from '../../../../../common/theme/colors';
import { AntDesign } from '@expo/vector-icons';
import { ScreenHeader } from '../../../../../common/components/organisms/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import { StaffStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { StackNavigationProp } from '@react-navigation/stack';

type StaffHomeScreenNavigationProp = StackNavigationProp<StaffStackParamList, 'Handover'>;

interface Motorbike {
  id: string;
  name: string;
  plate: string;
  batteryLevel: number;
  range: number;
  status: 'available' | 'rented' | 'charging' | 'maintenance';
  location: string;
  lastCharged: string;
  image: any;
}

export const StaffHomeScreen: React.FC = () => {
  const navigation = useNavigation<StaffHomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'rented' | 'charging' | 'maintenance'>('all');

  // Mock data for motorbikes
  const motorbikes: Motorbike[] = [
    {
      id: '1',
      name: 'VinFast Evo200',
      plate: '59X1-12345',
      batteryLevel: 85,
      range: 180,
      status: 'available',
      location: 'Bay A-01',
      lastCharged: '2 hours ago',
      image: require('../../../../../../../assets/images/motor.png'),
    },
    {
      id: '2',
      name: 'VinFast Evo200',
      plate: '59X1-12346',
      batteryLevel: 45,
      range: 95,
      status: 'charging',
      location: 'Bay A-02',
      lastCharged: 'Currently charging',
      image: require('../../../../../../../assets/images/motor.png'),
    },
    {
      id: '3',
      name: 'VinFast Evo200',
      plate: '59X1-12347',
      batteryLevel: 92,
      range: 200,
      status: 'rented',
      location: 'Out for rental',
      lastCharged: '6 hours ago',
      image: require('../../../../../../../assets/images/motor.png'),
    },
    {
      id: '4',
      name: 'VinFast Evo200',
      plate: '59X1-12348',
      batteryLevel: 15,
      range: 30,
      status: 'maintenance',
      location: 'Service Bay',
      lastCharged: '1 day ago',
      image: require('../../../../../../../assets/images/motor.png'),
    },
    {
      id: '5',
      name: 'VinFast Evo200',
      plate: '59X1-12349',
      batteryLevel: 78,
      range: 165,
      status: 'available',
      location: 'Bay B-01',
      lastCharged: '4 hours ago',
      image: require('../../../../../../../assets/images/motor.png'),
    },
    {
      id: '6',
      name: 'VinFast Evo200',
      plate: '59X1-12350',
      batteryLevel: 100,
      range: 220,
      status: 'available',
      location: 'Bay B-02',
      lastCharged: 'Just charged',
      image: require('../../../../../../../assets/images/motor.png'),
    },
  ];

  const filteredMotorbikes = motorbikes.filter(bike => {
    const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bike.plate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bike.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#67D16C';
      case 'rented': return '#FFB300';
      case 'charging': return '#C9B6FF';
      case 'maintenance': return '#FF6B6B';
      default: return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'rented': return 'Rented';
      case 'charging': return 'Charging';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 70) return '#67D16C';
    if (level >= 40) return '#FFB300';
    return '#FF6B6B';
  };

  const renderMotorbikeCard = ({ item }: { item: Motorbike }) => (
    <TouchableOpacity style={styles.motorbikeCard}>
      <View style={styles.cardHeader}>
        <View style={styles.motorbikeInfo}>
          <Text style={styles.motorbikeName}>{item.name}</Text>
          <Text style={styles.motorbikePlate}>{item.plate}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Image source={item.image} style={styles.motorbikeImage} />

      <View style={styles.cardContent}>
        <View style={styles.batterySection}>
          <View style={styles.batteryHeader}>
            <AntDesign name="thunderbolt" size={16} color={getBatteryColor(item.batteryLevel)} />
            <Text style={styles.batteryLabel}>Battery</Text>
            <Text style={[styles.batteryLevel, { color: getBatteryColor(item.batteryLevel) }]}>
              {item.batteryLevel}%
            </Text>
          </View>
          <View style={styles.batteryBar}>
            <View 
              style={[
                styles.batteryFill, 
                { 
                  width: `${item.batteryLevel}%`,
                  backgroundColor: getBatteryColor(item.batteryLevel)
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <AntDesign name="environment" size={14} color={colors.text.secondary} />
            <Text style={styles.infoText}>{item.range} km range</Text>
          </View>
          <View style={styles.infoItem}>
            <AntDesign name="home" size={14} color={colors.text.secondary} />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.lastChargedRow}>
          <AntDesign name="clock-circle" size={12} color={colors.text.secondary} />
          <Text style={styles.lastChargedText}>Last charged: {item.lastCharged}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('MotorbikeDetail', { motorbikeId: item.id })}
        >
          <AntDesign name="eye" size={16} color={colors.text.primary} />
          <Text style={styles.actionText}>View Details</Text>
        </TouchableOpacity>
        {item.status === 'available' && (
          <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
            <AntDesign name="car" size={16} color="#000" />
            <Text style={[styles.actionText, styles.primaryActionText]}>Start Handover</Text>
          </TouchableOpacity>
        )}
        {item.status === 'charging' && (
          <TouchableOpacity style={[styles.actionButton, styles.chargingAction]}>
            <AntDesign name="thunderbolt" size={16} color="#000" />
            <Text style={[styles.actionText, styles.chargingActionText]}>Charging Status</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const filterButtons = [
    { key: 'all', label: 'All', count: motorbikes.length },
    { key: 'available', label: 'Available', count: motorbikes.filter(b => b.status === 'available').length },
    { key: 'rented', label: 'Rented', count: motorbikes.filter(b => b.status === 'rented').length },
    { key: 'charging', label: 'Charging', count: motorbikes.filter(b => b.status === 'charging').length },
    { key: 'maintenance', label: 'Maintenance', count: motorbikes.filter(b => b.status === 'maintenance').length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Branch Motorbikes"
          subtitle="District 2 Branch - 6 vehicles"
          showBackButton={false}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <AntDesign name="search" size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or plate..."
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <AntDesign name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filterButtons.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  filterStatus === filter.key && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus(filter.key as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterStatus === filter.key && styles.filterButtonTextActive,
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterCount,
                  filterStatus === filter.key && styles.filterCountActive,
                ]}>
                  <Text style={[
                    styles.filterCountText,
                    filterStatus === filter.key && styles.filterCountTextActive,
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <AntDesign name="check-circle" size={24} color="#67D16C" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <AntDesign name="car" size={24} color="#FFB300" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Rented</Text>
          </View>
          <View style={styles.statCard}>
            <AntDesign name="thunderbolt" size={24} color="#C9B6FF" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Charging</Text>
          </View>
          <View style={styles.statCard}>
            <AntDesign name="tool" size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Maintenance</Text>
          </View>
        </View>

        {/* Motorbikes List */}
        <View style={styles.motorbikesContainer}>
          <Text style={styles.sectionTitle}>
            Motorbikes ({filteredMotorbikes.length})
          </Text>
          <FlatList
            data={filteredMotorbikes}
            renderItem={renderMotorbikeCard}
            keyExtractor={(item) => item.id}
            numColumns={1}
            scrollEnabled={false}
            contentContainerStyle={styles.motorbikesList}
          />
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: colors.text.primary,
    fontSize: 14,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#C9B6FF',
    borderColor: '#C9B6FF',
  },
  filterButtonText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  filterCount: {
    backgroundColor: '#3A3A3A',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: '#000',
  },
  filterCountText: {
    color: colors.text.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  filterCountTextActive: {
    color: '#C9B6FF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  statNumber: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 10,
    marginTop: 2,
  },
  motorbikesContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  motorbikesList: {
    gap: 12,
  },
  motorbikeCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  motorbikeInfo: {
    flex: 1,
  },
  motorbikeName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  motorbikePlate: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
  motorbikeImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  cardContent: {
    marginBottom: 12,
  },
  batterySection: {
    marginBottom: 12,
  },
  batteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  batteryLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  batteryLevel: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  batteryBar: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  lastChargedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastChargedText: {
    color: colors.text.secondary,
    fontSize: 11,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingVertical: 8,
    gap: 4,
  },
  primaryAction: {
    backgroundColor: '#C9B6FF',
  },
  chargingAction: {
    backgroundColor: '#9C27B0',
  },
  actionText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  primaryActionText: {
    color: '#000',
  },
  chargingActionText: {
    color: '#FFFFFF',
  },
});
