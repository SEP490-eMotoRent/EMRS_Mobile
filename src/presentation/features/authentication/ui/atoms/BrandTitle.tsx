import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { AppColors } from '../../../../common/constants/AppColor';

interface BrandTitleProps {
    title: string;
    accessibilityLabel?: string;
}

export const BrandTitle: React.FC<BrandTitleProps> = ({ title, accessibilityLabel }) => {
    const screenWidth = Dimensions.get('window').width;

    return (
        <Text
        style={[styles.text, { fontSize: screenWidth * 0.13 }]}
        accessibilityLabel={accessibilityLabel}
        >
        {title}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        color: AppColors.white,
        lineHeight: undefined, // React Native uses fontSize * lineHeightFactor
        letterSpacing: -1,
    },
});