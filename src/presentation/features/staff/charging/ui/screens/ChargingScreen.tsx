import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { colors } from '../../../../../common/theme/colors';
import { AntDesign } from '@expo/vector-icons';
import { ScreenHeader } from '../../../../../common/components/organisms/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import { StaffStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { StackNavigationProp } from '@react-navigation/stack';

type ChargingScreenNavigationProp = StackNavigationProp<StaffStackParamList, 'Handover'>;

interface TimeSlot {
  id: string;
  time: string;
  type: 'peak' | 'off-peak';
  price: number;
  available: boolean;
}

export const ChargingScreen: React.FC = () => {
  const navigation = useNavigation<ChargingScreenNavigationProp>();
  const [scannedPlate, setScannedPlate] = useState<string>('');
  const [manualPlate, setManualPlate] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<string>('');
  const [odometer, setOdometer] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Mock time slots data
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00-11:00', type: 'peak', price: 2.5, available: true },
    { id: '2', time: '11:00-13:00', type: 'off-peak', price: 1.8, available: true },
    { id: '3', time: '13:00-15:00', type: 'off-peak', price: 1.8, available: false },
    { id: '4', time: '15:00-17:00', type: 'peak', price: 2.5, available: true },
    { id: '5', time: '17:00-19:00', type: 'peak', price: 3.0, available: true },
    { id: '6', time: '19:00-21:00', type: 'off-peak', price: 1.5, available: true },
  ];

  const handleQRScan = () => {
    setIsScanning(true);
    // Simulate QR scan
    setTimeout(() => {
      setScannedPlate('59X1-12345');
      setIsScanning(false);
    }, 2000);
  };

  const handleManualInput = () => {
    if (manualPlate.trim()) {
      setScannedPlate(manualPlate.trim());
      setManualPlate('');
    }
  };

  const calculateChargingFee = () => {
    if (!selectedSlot || !batteryLevel || !odometer) return 0;
    
    const battery = parseInt(batteryLevel);
    const km = parseInt(odometer);
    const baseFee = selectedSlot.price;
    const batteryFactor = (100 - battery) / 100;
    const kmFactor = km / 1000;
    
    return Math.round((baseFee * batteryFactor * kmFactor) * 100) / 100;
  };

  const handleCreateChargingRecord = () => {
    if (!scannedPlate || !selectedSlot || !batteryLevel || !odometer) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const fee = calculateChargingFee();
    Alert.alert(
      'Charging Record Created',
      `Vehicle: ${scannedPlate}\nTime Slot: ${selectedSlot.time}\nBattery: ${batteryLevel}%\nOdometer: ${odometer}km\nFee: $${fee}`,
      [{ text: 'OK', onPress: () => {
        // Reset form
        setScannedPlate('');
        setBatteryLevel('');
        setOdometer('');
        setSelectedSlot(null);
      }}]
    );
  };

  const getCurrentTimeSlotType = () => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 11) return 'peak';
    if (hour >= 11 && hour < 13) return 'off-peak';
    if (hour >= 13 && hour < 15) return 'off-peak';
    if (hour >= 15 && hour < 17) return 'peak';
    if (hour >= 17 && hour < 19) return 'peak';
    if (hour >= 19 && hour < 21) return 'off-peak';
    return 'off-peak';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Electric Motorbike Charging"
          subtitle="Manage charging sessions"
          showBackButton={false}
        />

        {/* Vehicle Identification */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Vehicle Identification</Text>
          
          {/* QR Scan Section */}
          <View style={styles.scanSection}>
            <TouchableOpacity
              style={[styles.scanButton, isScanning && styles.scanButtonActive]}
              onPress={handleQRScan}
              disabled={isScanning}
            >
              <AntDesign
                name={isScanning ? "loading" : "scan"} 
                size={24} 
                color={isScanning ? "#C9B6FF" : "#000"} 
              />
              <Text style={styles.scanButtonText}>
                {isScanning ? 'Scanning...' : 'Scan QR Code'}
              </Text>
            </TouchableOpacity>
            
            {scannedPlate ? (
              <View style={styles.scannedResult}>
                <AntDesign name="check-circle" size={20} color="#67D16C" />
                <Text style={styles.scannedText}>Vehicle: {scannedPlate}</Text>
              </View>
            ) : null}
          </View>

          {/* Manual Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Or enter license plate manually:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 59X1-12345"
                value={manualPlate}
                onChangeText={setManualPlate}
                placeholderTextColor={colors.text.secondary}
              />
              <TouchableOpacity
                style={styles.inputButton}
                onPress={handleManualInput}
              >
                <AntDesign name="check" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Charging Information */}
        {scannedPlate && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Charging Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Battery Level (%)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 30"
                value={batteryLevel}
                onChangeText={setBatteryLevel}
                keyboardType="numeric"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Odometer (km)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 1250"
                value={odometer}
                onChangeText={setOdometer}
                keyboardType="numeric"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </View>
        )}

        {/* Time Slot Selection */}
        {scannedPlate && batteryLevel && odometer && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Select Charging Time Slot</Text>
            <Text style={styles.timeSlotNote}>
              Current period: {getCurrentTimeSlotType() === 'peak' ? 'Peak Hours' : 'Off-Peak Hours'}
            </Text>
            
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlotItem,
                    selectedSlot?.id === slot.id && styles.timeSlotSelected,
                    !slot.available && styles.timeSlotUnavailable,
                  ]}
                  onPress={() => slot.available && setSelectedSlot(slot)}
                  disabled={!slot.available}
                >
                  <View style={styles.timeSlotHeader}>
                    <Text style={[
                      styles.timeSlotTime,
                      selectedSlot?.id === slot.id && styles.timeSlotTimeSelected,
                      !slot.available && styles.timeSlotTimeUnavailable,
                    ]}>
                      {slot.time}
                    </Text>
                    <View style={[
                      styles.timeSlotType,
                      slot.type === 'peak' ? styles.peakType : styles.offPeakType,
                    ]}>
                      <Text style={styles.timeSlotTypeText}>
                        {slot.type === 'peak' ? 'PEAK' : 'OFF-PEAK'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.timeSlotPrice,
                    selectedSlot?.id === slot.id && styles.timeSlotPriceSelected,
                    !slot.available && styles.timeSlotPriceUnavailable,
                  ]}>
                    ${slot.price}/kWh
                  </Text>
                  {!slot.available && (
                    <Text style={styles.unavailableText}>Unavailable</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Charging Fee Preview */}
        {selectedSlot && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Charging Fee Preview</Text>
            <View style={styles.feePreview}>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Base Rate:</Text>
                <Text style={styles.feeValue}>${selectedSlot.price}/kWh</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Battery Level:</Text>
                <Text style={styles.feeValue}>{batteryLevel}%</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Odometer:</Text>
                <Text style={styles.feeValue}>{odometer} km</Text>
              </View>
              <View style={styles.feeDivider} />
              <View style={styles.feeRow}>
                <Text style={styles.totalFeeLabel}>Estimated Total:</Text>
                <Text style={styles.totalFeeValue}>${calculateChargingFee()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Create Charging Record Button */}
        {selectedSlot && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateChargingRecord}
          >
            <AntDesign name="plus-circle" size={20} color="#000" />
            <Text style={styles.createButtonText}>Create Charging Record</Text>
          </TouchableOpacity>
        )}
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
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#C9B6FF',
  },
  scanSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#C9B6FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  scanButtonActive: {
    backgroundColor: '#9C27B0',
  },
  scanButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  scannedResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scannedText: {
    color: '#67D16C',
    fontWeight: '600',
  },
  inputSection: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text.primary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  inputButton: {
    backgroundColor: '#C9B6FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotNote: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  timeSlotsContainer: {
    gap: 8,
  },
  timeSlotItem: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  timeSlotSelected: {
    borderColor: '#C9B6FF',
    backgroundColor: '#2A1E3A',
  },
  timeSlotUnavailable: {
    opacity: 0.5,
  },
  timeSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeSlotTime: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  timeSlotTimeSelected: {
    color: '#C9B6FF',
  },
  timeSlotTimeUnavailable: {
    color: colors.text.secondary,
  },
  timeSlotType: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  peakType: {
    backgroundColor: '#FF6B6B',
  },
  offPeakType: {
    backgroundColor: '#4ECDC4',
  },
  timeSlotTypeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  timeSlotPrice: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  timeSlotPriceSelected: {
    color: '#C9B6FF',
    fontWeight: '600',
  },
  timeSlotPriceUnavailable: {
    color: colors.text.secondary,
  },
  unavailableText: {
    color: '#FF6B6B',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  feePreview: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeLabel: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  feeValue: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  feeDivider: {
    height: 1,
    backgroundColor: '#3A3A3A',
    marginVertical: 8,
  },
  totalFeeLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  totalFeeValue: {
    color: '#C9B6FF',
    fontSize: 14,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#C9B6FF',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  createButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
});
