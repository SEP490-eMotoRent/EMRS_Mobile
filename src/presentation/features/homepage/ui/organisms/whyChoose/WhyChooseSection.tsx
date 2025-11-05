import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BatteryIconFeature } from '../../atoms/icons/BatteryIcon';
import { BoltIcon } from '../../atoms/icons/BoltIcon';
import { ShieldIcon } from '../../atoms/icons/ShieldIcon';
import { BodyText } from '../../atoms/typography/BodyText';
import { Heading2 } from '../../atoms/typography/Heading2';
import { FeatureCard } from '../../molecules/features/FeatureCard';

export const WhyChooseSection: React.FC = () => (
    <View style={styles.container}>
        <Heading2 style={styles.heading}>Tại sao chọn eMotoRent</Heading2>
        <BodyText style={styles.subText}>
        Trải nghiệm tương lai giao thông với dịch vụ thuê xe máy điện cao cấp của chúng tôi.
        </BodyText>

        <FeatureCard
        icon={<BoltIcon />}
        title="Đội xe 100% điện"
        description="Toàn bộ đội xe gồm xe máy điện cao cấp, không khí thải và trải nghiệm lái êm ái, yên tĩnh."
        />

        <FeatureCard
        icon={<BatteryIconFeature />}
        title="Phạm vi xa"
        description="Tất cả xe đều có pin phạm vi mở rộng, đảm bảo bạn khám phá thành phố và xa hơn mà không lo hết pin."
        />

        <FeatureCard
        icon={<ShieldIcon />}
        title="Bảo hiểm toàn diện"
        description="Lái xe yên tâm với gói bảo hiểm toàn diện được thiết kế riêng cho xe điện."
        />

    </View>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        padding: 16,
    },
    heading: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 12,
    },
    subText: {
        textAlign: 'center',
        marginBottom: 32,
    },
});