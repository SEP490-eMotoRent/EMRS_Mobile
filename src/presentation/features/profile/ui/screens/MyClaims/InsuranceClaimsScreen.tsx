import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ProfileStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { Icon } from '../../../../insuranceClaim/ui/atoms/icons/Icon';
import { useInsuranceClaims } from '../../../hooks/insuranceClaims/useInsuranceClaims';
import { InsuranceClaimsList } from '../../organisms/List/InsuranceClaimsList';

type InsuranceClaimsScreenNavigationProp = StackNavigationProp<
    ProfileStackParamList,
    'InsuranceClaims'
>;

interface InsuranceClaimsScreenProps {
    navigation: InsuranceClaimsScreenNavigationProp;
}

export const InsuranceClaimsScreen: React.FC<InsuranceClaimsScreenProps> = ({ 
    navigation 
}) => {
    const { claims, loading, error, refresh } = useInsuranceClaims();

    const handleClaimPress = (claimId: string) => {
        navigation.navigate('InsuranceClaimDetail', { claimId });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Icon name="arrow-left" color="#fff" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Yêu Cầu Bảo Hiểm</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Icon name="arrow-left" color="#fff" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Yêu Cầu Bảo Hiểm</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={refresh} style={styles.retryButton}>
                        <Text style={styles.retryText}>Thử Lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Icon name="arrow-left" color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Yêu Cầu Bảo Hiểm</Text>
                <View style={styles.placeholder} />
            </View>

            <InsuranceClaimsList
                claims={claims}
                onClaimPress={handleClaimPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    placeholder: {
        width: 40,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    errorText: {
        color: '#f87171',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#00ff00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});