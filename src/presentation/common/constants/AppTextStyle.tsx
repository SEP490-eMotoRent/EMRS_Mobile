import { StyleSheet, TextStyle } from 'react-native';
import { AppColors } from './AppColor';

export const AppTextStyles = StyleSheet.create({
    body: {
        fontSize: 16,
        color: AppColors.white,
    } as TextStyle,
    button: {
        fontSize: 18,
        color: AppColors.white,
        fontWeight: 'bold',
    } as TextStyle,
});