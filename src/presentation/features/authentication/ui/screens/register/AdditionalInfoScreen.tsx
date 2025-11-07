import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
} from 'react-native';
import sl from '../../../../../../core/di/InjectionContainer';
import { RegisterUseCase } from '../../../../../../domain/usecases/account/RegisterUseCase';
import { BackButton } from '../../../../../common/components';
import { colors } from '../../../../../common/theme/colors';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';
import { BrandTitle, PrivacyNotice } from '../../atoms';
import { AdditionalInfoForm } from '../../organism/register/AdditionalInfoForm';

type AdditionalInfoScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AdditionalInfo'>;
type AdditionalInfoScreenRouteProp = RouteProp<AuthStackParamList, 'AdditionalInfo'>;

export const AdditionalInfoScreen: React.FC = () => {
    const navigation = useNavigation<AdditionalInfoScreenNavigationProp>();
    const route = useRoute<AdditionalInfoScreenRouteProp>();
    const [loading, setLoading] = useState(false);

    // Get email and password from previous screen
    const { email, password } = route.params;

    const handleComplete = async (data: { 
        fullname: string; 
        username: string; 
        phone: string; 
        address: string; 
        dateOfBirth: string;
        avatarUrl?: string;
    }) => {
        try {
        setLoading(true);

        const registerUseCase = new RegisterUseCase(sl.get('AccountRepository'));

        // Now we have ALL the data to call the API
        await registerUseCase.execute({
            email: email,
            username: data.username,
            fullname: data.fullname,
            password: password,
            phone: data.phone,
            address: data.address,
            dateOfBirth: data.dateOfBirth,
            avatarUrl: data.avatarUrl || '',
        });

        Alert.alert('Thành công', 'Tạo tài khoản thành công!', [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);

        } catch (error: any) {
        Alert.alert('Đăng ký thất bại', error.message || 'Đã xảy ra lỗi');
        console.error('Registration error:', error);
        } finally {
        setLoading(false);
        }
    };

    const handlePrivacyPolicy = () => {
        console.log('Privacy policy');
    };

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}>
            <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            <BackButton onPress={() => navigation.goBack()} />

            <BrandTitle subtitle="Hoàn tất hồ sơ của bạn" />

            <AdditionalInfoForm onComplete={handleComplete} loading={loading} />

            <PrivacyNotice onPrivacyPolicyPress={handlePrivacyPolicy} />
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
});