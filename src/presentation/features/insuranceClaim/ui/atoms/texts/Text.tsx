import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export interface TextProps extends RNTextProps {
    variant?: 'default' | 'title' | 'subtitle' | 'caption';
    children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ 
    variant = 'default', 
    style, 
    children,
    ...props 
}) => {
    const variantStyle = styles[variant];
    
    return (
        <RNText style={[variantStyle, style]} {...props}>
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    default: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    caption: {
        fontSize: 12,
        color: '#999999',
    },
});