import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../common/theme/colors';

interface PrivacyNoticeProps {
    onPrivacyPolicyPress: () => void;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ onPrivacyPolicyPress }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <Text style={styles.link} onPress={onPrivacyPolicyPress}>
                    Chính sách bảo mật
                </Text>
                {' '}của chúng tôi
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    text: {
        color: colors.text.secondary,
        fontSize: 14,
        textAlign: 'center',
    },
    link: {
        color: colors.text.accent,
        fontWeight: '500',
    },
});