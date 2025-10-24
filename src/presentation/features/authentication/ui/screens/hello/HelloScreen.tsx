import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../../../../../presentation/features/authentication/notifiers/AuthContext';
import { AuthStackParamList } from '../../../../shared/navigation/Authentication/AuthNavigator';
import { HelloBody } from '../organism/HelloBody';
import { HelloPageTemplate } from '../templates/HelloPageTemplate';

type Props = NativeStackScreenProps<AuthStackParamList, 'Hello'>;

export const HelloScreen: React.FC<Props> = ({ navigation }) => {
    const { authState } = useAuth();

    return (
        <HelloPageTemplate body={<HelloBody navigation={navigation} />} />
    );
};