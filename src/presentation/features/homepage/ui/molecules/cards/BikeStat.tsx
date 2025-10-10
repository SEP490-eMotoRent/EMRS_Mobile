import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SmallText } from '../../atoms/typography/SmallText';

interface BikeStatProps {
    icon: React.ReactNode;
    value: string;
}

export const BikeStat: React.FC<BikeStatProps> = ({ icon, value }) => (
    <View style={styles.container}>
        {icon}
        <SmallText style={styles.text}>{value}</SmallText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    text: {
        color: '#D1D5DB', // gray-300
    },
});
