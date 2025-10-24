import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { colors } from '../../../../../common/theme/colors';
import { AntDesign } from '@expo/vector-icons';
import { ScreenHeader } from '../../../../../common/components/organisms/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import { StaffStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../../../authentication/store/hooks';
import { removeAuth } from '../../../../authentication/store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

type StaffProfileScreenNavigationProp = StackNavigationProp<StaffStackParamList, 'Profile'>;

interface StaffStats {
  totalHandovers: number;
  totalReturns: number;
  totalScans: number;
  rating: number;
  workingHours: string;
  branch: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export const StaffProfileScreen: React.FC = () => {
  const navigation = useNavigation<StaffProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [showStats, setShowStats] = useState(false);

  // Mock staff data
  const staffStats: StaffStats = {
    totalHandovers: 156,
    totalReturns: 142,
    totalScans: 298,
    rating: 4.8,
    workingHours: '8:00 AM - 5:00 PM',
    branch: 'District 2 eMotoRent Branch',
  };

  const quickActions: QuickAction[] = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      icon: 'edit',
      color: '#C9B6FF',
      onPress: () => console.log('Edit Profile'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell',
      color: '#67D16C',
      onPress: () => console.log('Notifications'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'setting',
      color: '#FFB300',
      onPress: () => console.log('Settings'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'question-circle',
      color: '#FF6B6B',
      onPress: () => console.log('Help & Support'),
    },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(removeAuth());
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Profile"
          subtitle="Staff Account"
          showBackButton={false}
        />

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../../../../../assets/images/avatar.png')}
              style={styles.avatar}
            />
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.staffName}>{user?.fullName || 'Staff Member'}</Text>
            <Text style={styles.staffRole}>{user?.role || 'STAFF'}</Text>
            <Text style={styles.branchName}>{staffStats.branch}</Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => console.log('Edit Profile')}
          >
            <AntDesign name="edit" size={16} color="#C9B6FF" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Performance Overview</Text>
            <TouchableOpacity
              onPress={() => setShowStats(!showStats)}
              style={styles.toggleButton}
            >
              <AntDesign
                name={showStats ? 'up' : 'down'}
                size={16}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          {showStats && (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{staffStats.totalHandovers}</Text>
                <Text style={styles.statLabel}>Handovers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{staffStats.totalReturns}</Text>
                <Text style={styles.statLabel}>Returns</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{staffStats.totalScans}</Text>
                <Text style={styles.statLabel}>Scans</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{staffStats.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <AntDesign name={action.icon as any} size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Work Schedule */}
        <View style={styles.scheduleCard}>
          <Text style={styles.sectionTitle}>Work Schedule</Text>
          <View style={styles.scheduleItem}>
            <AntDesign name="clock-circle" size={16} color={colors.text.secondary} />
            <Text style={styles.scheduleText}>{staffStats.workingHours}</Text>
          </View>
          <View style={styles.scheduleItem}>
            <AntDesign name="environment" size={16} color={colors.text.secondary} />
            <Text style={styles.scheduleText}>{staffStats.branch}</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <AntDesign name="logout" size={20} color="#FF6B6B" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#C9B6FF',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#67D16C',
  },
  statusText: {
    color: '#67D16C',
    fontSize: 10,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  staffName: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  staffRole: {
    color: '#C9B6FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  branchName: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  editButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 8,
  },
  statsCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  toggleButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    width: '45%',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    color: '#C9B6FF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  actionsCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionItem: {
    width: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  scheduleText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  signOutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});
