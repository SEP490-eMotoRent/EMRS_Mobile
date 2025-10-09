import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface TextLinkProps {
    text: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const TextLink: React.FC<TextLinkProps> = ({ 
    text, 
    onPress, 
    style,
    textStyle 
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <Text style={[styles.text, textStyle]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    text: {
        color: colors.text.accent,
        fontSize: 14,
        fontWeight: '500',
    },
});