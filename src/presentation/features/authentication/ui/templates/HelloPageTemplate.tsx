import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppColors } from '../../../../common/constants/AppColor';

interface HelloPageTemplateProps {
    body: React.ReactNode;
    backgroundColor?: string;
}

export const HelloPageTemplate: React.FC<HelloPageTemplateProps> = ({
    body,
    backgroundColor = AppColors.black,
}) => {
    return <View style={[styles.container, { backgroundColor }]}>{body}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});