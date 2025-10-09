import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../../shared/navigation/AuthNavigator';
import { HelloPageTemplate } from '../templates/HelloPageTemplate';
import { HelloBody } from '../organism/HelloBody';
import { useAuth } from '../../../../../presentation/features/authentication/notifiers/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

export const HelloScreen: React.FC<Props> = ({ navigation }) => {
    const { authState } = useAuth();

    return (
        <HelloPageTemplate body={<HelloBody navigation={navigation} />} />
    );
};