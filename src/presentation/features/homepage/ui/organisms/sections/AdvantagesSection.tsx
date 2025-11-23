import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Advantage {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
}

export const AdvantagesSection: React.FC = () => {
    const advantages: Advantage[] = [
        {
            icon: 'flash-outline',
            title: 'Đội xe 100% điện',
            description: 'Xe máy điện cao cấp, không khí thải, lái êm ái và yên tĩnh',
        },
        {
            icon: 'battery-charging-outline',
            title: 'Phạm vi hoạt động xa',
            description: 'Pin mở rộng, đi xa mà không lo hết pin',
        },
        {
            icon: 'shield-checkmark-outline',
            title: 'Bảo hiểm toàn diện',
            description: 'An tâm với gói bảo hiểm đầy đủ cho xe điện',
        },
        {
            icon: 'rocket-outline',
            title: 'Giao xe nhanh chóng',
            description: 'Nhận xe trong 30 phút hoặc đặt trước',
        },
        {
            icon: 'wallet-outline',
            title: 'Giá cả minh bạch',
            description: 'Không phí ẩn, giá rõ ràng từ đầu',
        },
        {
            icon: 'construct-outline',
            title: 'Bảo trì định kỳ',
            description: 'Xe luôn trong tình trạng tốt nhất',
        },
        {
            icon: 'location-outline',
            title: 'Nhiều địa điểm',
            description: 'Phủ sóng khắp các quận trung tâm',
        },
        {
            icon: 'headset-outline',
            title: 'Hỗ trợ 24/7',
            description: 'Luôn sẵn sàng hỗ trợ bạn mọi lúc',
        },
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tại sao chọn eMotoRent</Text>
            <Text style={styles.subtitle}>
                Trải nghiệm thuê xe máy điện hiện đại, tiện lợi và đáng tin cậy
            </Text>
            <View style={styles.grid}>
                {advantages.map((advantage, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Ionicons name={advantage.icon} size={32} color="#8B5CF6" />
                        </View>
                        <Text style={styles.cardTitle}>{advantage.title}</Text>
                        <Text style={styles.cardDescription}>{advantage.description}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        backgroundColor: '#1F1F1F',
        borderRadius: 16,
        padding: 20,
        width: '48%',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        minHeight: 140,
    },
    iconContainer: {
        marginBottom: 12,
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
    },
    cardDescription: {
        color: '#9CA3AF',
        fontSize: 13,
        lineHeight: 18,
    },
});