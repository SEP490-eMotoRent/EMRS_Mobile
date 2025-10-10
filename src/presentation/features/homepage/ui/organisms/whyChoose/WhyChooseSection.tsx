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
        <Heading2 style={styles.heading}>Why Choose eMotoRent</Heading2>
        <BodyText style={styles.subText}>
        Experience the future of transportation with our premium electric motorbike rental service.
        </BodyText>

        <FeatureCard
        icon={<BoltIcon />}
        title="100% Electric Fleet"
        description="Our entire fleet consists of premium electric motorbikes, offering zero emissions and a smooth, quiet riding experience."
        />

        <FeatureCard
        icon={<BatteryIconFeature />}
        title="Long Range Capability"
        description="All our bikes come with extended range batteries, ensuring you can explore the city and beyond without range anxiety."
        />

        <FeatureCard
        icon={<ShieldIcon />}
        title="Comprehensive Insurance"
        description="Ride with peace of mind knowing you're covered by our comprehensive insurance packages tailored for electric vehicles."
        />

        <View style={styles.calloutBox}>
        <Heading2 style={styles.calloutText}>Tap, Book, Go — It's That Easy</Heading2>
        </View>
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
    calloutBox: {
        backgroundColor: '#1F1F1F',
        padding: 24,
        borderRadius: 16,
        marginTop: 16,
        marginBottom: 32,
    },
    calloutText: {
        fontSize: 20,
        textAlign: 'center',
    },
});
