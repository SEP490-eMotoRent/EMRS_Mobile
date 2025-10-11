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
        <Heading1 style={styles.mainHeading}>Tap, Book, Go - It's That Easy</Heading1>
        
        <ProcessStepCard
            icon={<PhoneIcon />}
            title="Choose Your Bike"
            description="Top tier electric motorbikes all over the country"
        />
        
        <ProcessStepCard
            icon={<LightningBoltIcon />}
            title="Book Instantly"
            description="Reserve your bikes in seconds, verify yourself once for your first rental"
        />
        
        <ProcessStepCard
            icon={<BikeIcon />}
            title="Get In & Go"
            description="Your bike will be ready when you are - Just arrive, pick-up and go!"
        />
        
        <ProcessStepCard
            icon={<ClockIcon />}
            title="Pickup Or Delivery 24/7"
            description="Select either pickup or delivery and access your bike via the app no lines or hassles"
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