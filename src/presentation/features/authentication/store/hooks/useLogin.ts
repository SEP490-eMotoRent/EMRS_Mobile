import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import sl from '../../../../../core/di/InjectionContainer';
import { unwrapResponse } from '../../../../../core/network/APIResponse';
import { LoginResponseData } from '../../../../../data/models/account/accountDTO/LoginResponse';
import { LoginUseCase } from '../../../../../domain/usecases/account/LoginUseCase';

import { AuthStackParamList, RootStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { CompositeNavigationProp } from '@react-navigation/native';
import { useAppDispatch } from '../hooks';
import { addAuth } from '../slices/authSlice';

type LoginScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList, 'Login'>,
    StackNavigationProp<RootStackParamList>
    >;

    interface LoginCredentials {
    username: string;
    password: string;
    }

    interface UseLoginReturn {
    loading: boolean;
    error: string;
    login: (credentials: LoginCredentials) => Promise<void>;
    clearError: () => void;
    }

    const UNVERIFIED_EMAIL_KEYWORDS = [
    'verify your email',
    'verification',
    'otp',
    'chưa xác minh',
    'xác minh email',
    ];

    const isUnverifiedEmailError = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return UNVERIFIED_EMAIL_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
    };

    export const useLogin = (): UseLoginReturn => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
        setLoading(true);
        setError('');

        // Execute login use case
        const loginUseCase = new LoginUseCase(sl.get("AccountRepository"));
        const response = await loginUseCase.execute({
            username: credentials.username,
            password: credentials.password,
        });

        // Unwrap response
        const loginData: LoginResponseData = unwrapResponse(response);

        // Dispatch to Redux
        dispatch(
            addAuth({
            token: loginData.accessToken,
            user: {
                id: loginData.user.id,
                username: loginData.user.username,
                role: loginData.user.role,
                fullName: loginData.user.fullName,
                branchId: loginData.user.branchId,
                branchName: loginData.user.branchName,
            },
            })
        );

        // Show success toast
        Toast.show({
            type: "success",
            text1: "Đăng nhập thành công",
            text2: "Chào mừng bạn đến với eMotoRent",
        });

        // Navigation is handled by auth state change, no need to navigate here

        } catch (error: any) {
        const errorMessage = error.message || "Tên đăng nhập hoặc mật khẩu không đúng";
        
        // Check if it's an unverified email error
        if (isUnverifiedEmailError(errorMessage)) {
            // This will be handled by the screen with OTP modal
            throw error;
        } else {
            // Set user-friendly error message
            setError("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        
        console.error("Login error:", error);
        } finally {
        setLoading(false);
        }
    };

    const clearError = () => {
        setError('');
    };

    return {
        loading,
        error,
        login,
        clearError,
    };
};