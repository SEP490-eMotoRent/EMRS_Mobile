//Deprecated: Comparison section is no longer used in the homepage design

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ComparisonFeature } from '../../molecules/features/ComparisonFeature';

export const ComparisonSection: React.FC = () => {
    const eMotoFeatures = [
        "Không cần đặt cọc",
        "Gói linh hoạt từ tuần này sang tuần khác",
        "Không mất giá trị hoặc phí bán lại",
        "Bảo trì bao gồm",
        "Giao tận nơi, như đặt cơm",
    ];

    const traditionalIssues = [
        "Hàng nghìn đô la, mất trắng.",
        "Cam kết nhiều năm",
        "Mất tiền theo mỗi cây số",
        "Tự trả mọi chi phí",
        "Không được giao tận nơi",
    ];

    return (
        <View style={styles.section}>
        <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonMainTitle}>
            Tiện lợi hơn, ít ràng buộc hơn
            </Text>
            <Text style={styles.comparisonSubtitle}>
            Tại sao thuê xe theo gói eMotoRent vượt trội mọi lựa chọn khác
            </Text>
        </View>
        <View style={styles.comparisonContainer}>
            <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonColumnTitle}>Gói thuê eMotoRent</Text>
            {eMotoFeatures.map((feature, index) => (
                <ComparisonFeature key={index} text={feature} isPositive={true} />
            ))}
            </View>
            <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonColumnTitle}>Sở hữu truyền thống</Text>
            {traditionalIssues.map((issue, index) => (
                <ComparisonFeature key={index} text={issue} isPositive={false} />
            ))}
            </View>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    comparisonHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    comparisonMainTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    comparisonSubtitle: {
        color: '#9ca3af',
        fontSize: 18,
        textAlign: 'center',
    },
    comparisonContainer: {
        backgroundColor: 'rgba(31, 41, 55, 0.3)',
        borderRadius: 24,
        padding: 24,
    },
    comparisonColumn: {
        marginBottom: 32,
    },
    comparisonColumnTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
    },
});