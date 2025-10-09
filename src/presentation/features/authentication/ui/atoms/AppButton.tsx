import React from 'react';
import { TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { AppColors } from '../../../../common/constants/AppColor';
import { AppTextStyles } from '../../../../common/constants/AppTextStyle';


interface AppButtonProps {
    text: string;
    onPress?: () => void;
    color?: string;
    accessibilityLabel?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
    text,
    onPress,
    color = AppColors.blue,
    accessibilityLabel,
    }) => {
    const screenWidth = Dimensions.get('window').width;
    const buttonHeight = screenWidth * 0.14; // Responsive height based on width
    const fontSize = screenWidth * 0.045; // Responsive font size

    return (
        <TouchableOpacity
        style={[
            styles.button,
            {
            height: Math.min(Math.max(buttonHeight, 50), 70), // Min 50, max 70
            backgroundColor: color,
            },
        ]}
        onPress={onPress}
        disabled={!onPress}
        accessibilityLabel={accessibilityLabel}
        >
        <Text
            style={[
            AppTextStyles.button,
            {
                fontSize: Math.min(Math.max(fontSize, 18), 22), // Min 18, max 22
                color: AppColors.white,
            },
            ]}
        >
            {text}
        </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        paddingVertical: 16,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});