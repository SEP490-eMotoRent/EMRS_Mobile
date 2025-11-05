import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading1 } from '../../atoms/typography/Heading1';
import { PhoneIcon } from '../../atoms/icons/PhoneIcon';
import { BikeIcon } from '../../atoms/icons/BikeIcon';
import { ClockIcon } from '../../atoms/icons/ClockIcon';
import { ProcessStepCard } from '../../molecules/cards/ProcessStepCard';
import { BoltIcon } from '../../atoms/icons/BoltIcon';
import { LightningBoltIcon } from '../../atoms/icons/LightningBoltIcon2';

export const TapBookGoSection: React.FC = () => (
    <View style={styles.container}>
        <Heading1 style={styles.mainHeading}>Nhấn, Đặt, Đi - Đơn giản vậy thôi</Heading1>
        
        <ProcessStepCard
            icon={<PhoneIcon />}
            title="Chọn xe của bạn"
            description="Xe máy điện cao cấp khắp cả nước"
        />
        
        <ProcessStepCard
            icon={<LightningBoltIcon />}
            title="Đặt ngay lập tức"
            description="Đặt xe trong vài giây, xác minh một lần cho lần thuê đầu tiên"
        />
        
        <ProcessStepCard
            icon={<BikeIcon />}
            title="Nhận xe & Đi"
            description="Xe sẽ sẵn sàng khi bạn đến - Chỉ cần đến, nhận xe và đi!"
        />
        
        <ProcessStepCard
            icon={<ClockIcon />}
            title="Nhận hoặc giao hàng 24/7"
            description="Chọn nhận tại chỗ hoặc giao tận nơi và truy cập xe qua ứng dụng, không xếp hàng hay phiền phức"
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        paddingVertical: 48,
        paddingHorizontal: 16,
    },
    mainHeading: {
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 16,
    },
});