import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { colors } from '../../../../common/theme/colors';

interface PrimaryButtonProps {
    title: string;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
    flex?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    loading = false,
    flex = false,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button, 
                flex && styles.flexButton,
                style,
                isDisabled && styles.buttonDisabled
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isDisabled}
        >
            {loading ? (
                <ActivityIndicator 
                    size="small" 
                    color={colors.button.text} 
                />
            ) : (
                <Text 
                    style={[
                        styles.text, 
                        textStyle,
                        isDisabled && styles.textDisabled
                    ]}
                    allowFontScaling={false}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.button.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    flexButton: {
        flex: 1,
        paddingHorizontal: 12,
    },
    text: {
        color: colors.button.text,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#333',
        opacity: 0.5,
    },
    textDisabled: {
        color: '#666',
    },
});