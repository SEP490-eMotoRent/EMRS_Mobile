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
import { AppHeader } from '../../../../../common/components/organisms/AppHeader';
import { InfoCard } from '../../../../../common/components/molecules/InfoCard';
import { PrimaryButton } from '../../../../../common/components/atoms/PrimaryButton';

export const ReturnScreen: React.FC = () => {
  const handleStartReturn = () => {
    console.log('Start return process');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <AppHeader />

        {/* Scan Return Section */}
        <View style={styles.scanSection}>
          <InfoCard>
            <View style={styles.scanContent}>
              <View style={styles.scanLeft}>
                <Text style={styles.scanEmoji}>🔍</Text>
              </View>
              <View style={styles.scanRight}>
                <TouchableOpacity style={styles.scanButton}>
                  <AntDesign name="qrcode" size={16} color="#FFFFFF" />
                  <Text style={styles.scanButtonText}>Scan QR Code</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.scanTitle}>Xác thực xe trả</Text>
            <Text style={styles.scanDescription}>
              Quét mã QR trên xe để xác nhận thông tin và bắt đầu quy trình trả xe
            </Text>
          </InfoCard>
        </View>

        {/* Today's Returns Schedule */}
        <View style={styles.scheduleSection}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Lịch trả xe hôm nay</Text>
            <View style={styles.scheduleBadge}>
              <Text style={styles.scheduleBadgeText}>3</Text>
            </View>
          </View>

          {/* Return Item 1 */}
          <View style={styles.returnCard}>
            <View style={styles.returnHeader}>
              <View style={styles.timeSection}>
                <AntDesign name="clock-circle" size={16} color={colors.text.primary} />
                <Text style={styles.timeText}>02:00 PM - 02:30 PM</Text>
                <Text style={styles.timeSubtext}>In 1 hour</Text>
              </View>
              <TouchableOpacity style={styles.overdueButton}>
                <Text style={styles.overdueButtonText}>Overdue</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customerSection}>
              <View style={styles.customerInfo}>
                <AntDesign name="user" size={16} color={colors.text.primary} />
                <Text style={styles.customerName}>Alice Johnson</Text>
                <AntDesign name="warning" size={16} color="#FF6B35" />
                <Text style={styles.bookingId}>#EMR240915003</Text>
              </View>
            </View>

            <View style={styles.vehicleSection}>
              <View style={styles.vehicleImage} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>VinFast Klara S</Text>
                <Text style={styles.rentalDuration}>5 days rental (Overdue by 2 days)</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.returnInfo}>
              <Text style={styles.returnInfoTitle}>Return Information</Text>
              <View style={styles.returnDetails}>
                <View style={styles.returnDetailItem}>
                  <AntDesign name="calendar" size={14} color={colors.text.secondary} />
                  <Text style={styles.returnDetailText}>Original return: Sep 13, 2025</Text>
                </View>
                <View style={styles.returnDetailItem}>
                  <AntDesign name="exclamation-circle" size={14} color="#FF6B35" />
                  <Text style={styles.returnDetailText}>Late fee: $20/day</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Return Item 2 */}
          <View style={styles.returnCard}>
            <View style={styles.returnHeader}>
              <View style={styles.timeSection}>
                <AntDesign name="clock-circle" size={16} color={colors.text.primary} />
                <Text style={styles.timeText}>03:30 PM - 04:00 PM</Text>
                <Text style={styles.timeSubtext}>In 2.5 hours</Text>
              </View>
              <TouchableOpacity style={styles.onTimeButton}>
                <Text style={styles.onTimeButtonText}>On Time</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customerSection}>
              <View style={styles.customerInfo}>
                <AntDesign name="user" size={16} color={colors.text.primary} />
                <Text style={styles.customerName}>Bob Smith</Text>
                <AntDesign name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.bookingId}>#EMR240915004</Text>
              </View>
            </View>

            <View style={styles.vehicleSection}>
              <View style={styles.vehicleImage} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>VinFast Evo200</Text>
                <Text style={styles.rentalDuration}>3 days rental</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.returnInfo}>
              <Text style={styles.returnInfoTitle}>Return Information</Text>
              <View style={styles.returnDetails}>
                <View style={styles.returnDetailItem}>
                  <AntDesign name="calendar" size={14} color={colors.text.secondary} />
                  <Text style={styles.returnDetailText}>Scheduled return: Today</Text>
                </View>
                <View style={styles.returnDetailItem}>
                  <AntDesign name="check-circle" size={14} color="#4CAF50" />
                  <Text style={styles.returnDetailText}>No additional fees</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Action Button */}
          <PrimaryButton title="View All Returns" style={styles.viewDetailsButton} />
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
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for bottom navigation
  },
  header: {
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationButton: {
    padding: 8,
  },
  staffBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C9B6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  branchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
  },
  branchText: {
    color: colors.text.secondary,
    fontSize: 12,
    marginRight: 4,
  },
  scanSection: {
    marginBottom: 24,
  },
  scanCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 20,
  },
  scanContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanLeft: {
    flex: 1,
  },
  scanEmoji: {
    fontSize: 32,
  },
  scanRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9B6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  scanDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  scheduleSection: {
    marginBottom: 24,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: 8,
  },
  scheduleBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C9B6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  returnCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  returnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  timeSubtext: {
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: 8,
  },
  overdueButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  onTimeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onTimeButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  customerSection: {
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
  },
  bookingId: {
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: 8,
  },
  vehicleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleImage: {
    width: 40,
    height: 40,
    backgroundColor: '#444444',
    borderRadius: 8,
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  rentalDuration: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#444444',
    marginVertical: 16,
  },
  returnInfo: {
    marginBottom: 16,
  },
  returnInfoTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  returnDetails: {
    gap: 4,
  },
  returnDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnDetailText: {
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: 8,
  },
  viewDetailsButton: {
    backgroundColor: '#C9B6FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  viewDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
