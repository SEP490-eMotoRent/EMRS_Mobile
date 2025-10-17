import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../../../../common/theme/colors';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StaffStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { PrimaryButton } from '../../../../../common/components/atoms/buttons/PrimaryButton';

type ScanFaceScreenNavigationProp = StackNavigationProp<StaffStackParamList, 'ScanFace'>;

export const ScanFaceScreen: React.FC = () => {
  const navigation = useNavigation<ScanFaceScreenNavigationProp>();

  const handleStartFacialScan = () => {
    console.log('Start facial scan');
    navigation.navigate('ScanResult');
  };

  const handleScanID = () => {
    console.log('Scan ID Document');
  };

  const handleEnterOTP = () => {
    console.log('Enter OTP sent to customer');
  };

  const handleCallManager = () => {
    console.log('Call Manager for override');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Verify Customer Identity</Text>
          <Text style={styles.bookingId}>#EMR240915001</Text>
          <Text style={styles.customerName}>John Nguyen</Text>
        </View>

        {/* Customer Information Section */}
        <View style={styles.customerInfoSection}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerCard}>
            <View style={styles.customerAvatar}>
              <Text style={styles.avatarText}>😊</Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerNameLarge}>John Nguyen</Text>
              <Text style={styles.customerStatus}>Expected customer</Text>
              <Text style={styles.customerPhone}>Phone: ***8901</Text>
              <Text style={styles.customerVehicle}>Vehicle: VinFast Evo200</Text>
              <Text style={styles.pickupTime}>Pickup time: 10:30 AM</Text>
            </View>
          </View>
        </View>

        {/* Facial Scan Interface */}
        <View style={styles.scanInterfaceSection}>
          <View style={styles.scanFrame}>
            <View style={styles.scanFrameInner}>
              <View style={styles.cameraIconContainer}>
                <AntDesign name="camera" size={32} color={colors.text.primary} />
              </View>
            </View>
          </View>
          <Text style={styles.scanInstruction}>Position face within the frame</Text>
          
          <PrimaryButton title="Start Facial Scan" onPress={handleStartFacialScan} style={styles.scanButton} />
        </View>

        {/* Manual Verification Options */}
        <View style={styles.manualVerificationSection}>
          <Text style={styles.sectionTitle}>Manual Verification Options</Text>
          
          <TouchableOpacity style={styles.optionButton} onPress={handleScanID}>
            <AntDesign name="idcard" size={16} color={colors.text.primary} />
            <Text style={styles.optionText}>Scan ID Document</Text>
            <AntDesign name="right" size={16} color={colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleEnterOTP}>
            <AntDesign name="message" size={16} color={colors.text.primary} />
            <Text style={styles.optionText}>Enter OTP sent to customer</Text>
            <AntDesign name="right" size={16} color={colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleCallManager}>
            <AntDesign name="phone" size={16} color={colors.text.primary} />
            <Text style={styles.optionText}>Call Manager for override</Text>
            <AntDesign name="right" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  menuButton: {
    padding: 8,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  customerInfoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  customerCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 32,
  },
  customerDetails: {
    flex: 1,
  },
  customerNameLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  customerStatus: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  customerVehicle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  pickupTime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scanInterfaceSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scanFrame: {
    width: 280,
    height: 200,
    borderWidth: 2,
    borderColor: colors.text.primary,
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
  },
  scanFrameInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanInstruction: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#C9B6FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  manualVerificationSection: {
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    marginLeft: 12,
  },
});
