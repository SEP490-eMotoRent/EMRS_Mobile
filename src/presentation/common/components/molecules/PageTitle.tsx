import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface PageTitleProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center';
}

export const PageTitle: React.FC<PageTitleProps> = ({ 
    title, 
    subtitle,
    align = 'center' 
}) => {
    return (
        <View style={[styles.container, align === 'left' && styles.alignLeft]}>
            <Text style={[styles.title, align === 'left' && styles.titleLeft]}>
                {title}
            </Text>
            {subtitle && (
                <Text style={[styles.subtitle, align === 'left' && styles.subtitleLeft]}>
                    {subtitle}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 40,
    },
    alignLeft: {
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    titleLeft: {
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    subtitleLeft: {
        textAlign: 'left',
    },
});