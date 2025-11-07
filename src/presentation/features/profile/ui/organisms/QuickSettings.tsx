import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../atoms/Icons/Icons';
import { SettingItem } from '../molecules/settings/SettingItem';
import { SettingToggle } from '../molecules/settings/SettingToggle';

interface QuickSettingsProps {
    onSignOut: () => void;
}

export const QuickSettings: React.FC<QuickSettingsProps> = ({ onSignOut }) => {
    const [notifications, setNotifications] = useState<boolean>(true);
    
    return (
        <View style={styles.quickSettings}>
        <Text style={styles.sectionTitle}>Cài Đặt</Text>
        
        <View style={styles.settingsGroup}>
            <SettingToggle
            icon="bell"
            label="Notifications"
            value={notifications}
            onToggle={setNotifications}
            />
            <SettingItem icon="card" label="Payment Methods" showArrow />
            <SettingItem icon="location" label="Recent Pickup Location" value="District 2" />
            <SettingItem icon="language" label="Language" value="English" />
        </View>
        
        <TouchableOpacity style={styles.referCard}>
            <Icon name="gift" color="#a78bfa" />
            <View style={styles.referInfo}>
            <Text style={styles.referTitle}>Refer & Earn 100,000đ</Text>
            <Text style={styles.referSubtitle}>Share with friends and earn rewards</Text>
            </View>
            <Icon name="arrow" color="#666" />
        </TouchableOpacity>
        
        <View style={styles.settingsGroup}>
            <SettingItem icon="document" label="Rental History" />
            <SettingItem icon="location" label="Branch Locations" />
            <SettingItem icon="help" label="Help & Support Center" />
            <SettingItem icon="terms" label="Terms & Privacy Policy" />
        </View>
        
        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
            <Icon name="logout" color="#f87171" />
            <Text style={styles.signOutText}>Đăng Xuất</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    quickSettings: {
        margin: 16,
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    settingsGroup: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    referCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        gap: 12,
    },
    referInfo: {
        flex: 1,
    },
    referTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    referSubtitle: {
        color: '#999',
        fontSize: 13,
        marginTop: 2,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
        padding: 16,
    },
    signOutText: {
        color: '#f87171',
        fontSize: 16,
        fontWeight: '500',
    },
});