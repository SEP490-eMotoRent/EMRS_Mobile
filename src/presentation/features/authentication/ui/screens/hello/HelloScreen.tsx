import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { HelloBody } from '../../organism';
import { HelloPageTemplate } from '../../templates';
import { useAuth } from '../../../notifiers/AuthContext';
import { AuthStackParamList } from '../../../../../shared/navigation/StackParameters/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Hello'>;

export const HelloScreen: React.FC<Props> = ({ navigation }) => {
    const { authState } = useAuth();

    return (
        <HelloPageTemplate body={<HelloBody navigation={navigation} />} />
    );
};