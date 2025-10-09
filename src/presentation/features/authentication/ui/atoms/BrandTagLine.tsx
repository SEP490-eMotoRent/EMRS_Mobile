import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { AppColors } from '../../../../common/constants/AppColor';


interface BrandTaglineProps {
    line1: string;
    line2: string;
    accessibilityLabel?: string;
}

export const BrandTagline: React.FC<BrandTaglineProps> = ({ line1, line2, accessibilityLabel }) => {
    const screenWidth = Dimensions.get('window').width;

    return (
        <Text
        style={[styles.text, { fontSize: screenWidth * 0.055 }]}
        accessibilityLabel={accessibilityLabel}
        >
        {line1} {'\n'}
        {line2}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        color: AppColors.white + 'B3', // Approximate Colors.white70 (70% opacity)
        lineHeight: undefined, // React Native uses fontSize * lineHeightFactor
        textAlign: 'left',
    },
});