import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../atoms/Icons/Icons';
import { SettingItem } from '../molecules/settings/SettingItem';
import { SettingToggle } from '../molecules/settings/SettingToggle';

interface QuickSettingsProps {
    onSignOut: () => void;
    onInsuranceClaims?: () => void;
}

export const QuickSettings: React.FC<QuickSettingsProps> = ({ 
        onSignOut,
        onInsuranceClaims 
    }) => {
        const [notifications, setNotifications] = useState<boolean>(true);
    return (
        <View style={styles.quickSettings}>
        <Text style={styles.sectionTitle}>Cài Đặt</Text>
        
        <View style={styles.settingsGroup}>
            {/* <SettingToggle
                icon="bell"
                label="Thông Báo"
                value={notifications}
                onToggle={setNotifications}
            /> */}
            {/* <SettingItem icon="card" label="Phương Thức Thanh Toán" showArrow /> */}
            {/* <SettingItem icon="language" label="Ngôn Ngữ" value="Tiếng Việt" /> */}
        </View>
        
        {/* <TouchableOpacity style={styles.referCard}>
            <Icon name="gift" color="#a78bfa" />
            <View style={styles.referInfo}>
            <Text style={styles.referTitle}>Giới Thiệu & Nhận 100,000đ</Text>
            <Text style={styles.referSubtitle}>Chia sẻ với bạn bè và nhận phần thưởng</Text>
            </View>
            <Icon name="arrow" color="#666" />
        </TouchableOpacity> */}
        
        <View style={styles.settingsGroup}>
            {/* <SettingItem icon="document" label="Lịch Sử Thuê" /> */}
            <SettingItem 
                    icon="shield" 
                    label="Yêu Cầu Bảo Hiểm" 
                    showArrow 
                    onPress={onInsuranceClaims}
                />
            {/* <SettingItem icon="location" label="Địa Điểm Các Chi Nhánh" /> */}
            {/* <SettingItem icon="help" label="Chăm Sóc Khách Hàng" />
            <SettingItem icon="terms" label="Điều Khoản và Chính Sách" /> */}
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