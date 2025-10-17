import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../../../common/theme/colors';

interface BrandTitleProps {
    subtitle?: string;
    title?: string;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}


export const BrandTitle: React.FC<BrandTitleProps> = ({ subtitle, style, textStyle }) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.appTitle, textStyle]}>
                <Text style={styles.brandEmoto}>eMoto</Text>
                <Text style={styles.brandRent}>Rent</Text>
            </Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    appTitle: {
        fontSize: 56,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 8,
    },
    brandEmoto: {
        color: '#C9B6FF',
    },
    brandRent: {
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: 24,
        color: colors.text.secondary,
        textAlign: 'left',
    },
});