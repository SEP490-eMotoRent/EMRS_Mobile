import { useState } from 'react';
import Toast from 'react-native-toast-message';
import sl from '../../../../../core/di/InjectionContainer';
import { unwrapResponse } from '../../../../../core/network/APIResponse';
import { LoginResponseData } from '../../../../../data/models/account/accountDTO/LoginResponse';
import { useAppDispatch } from '../hooks';
import { addAuth } from '../slices/authSlice';


interface UseGoogleLoginReturn {
    loading: boolean;
    error: string;
    googleSignIn: () => Promise<void>;
    clearError: () => void;
}

export const useGoogleLogin = (): UseGoogleLoginReturn => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const googleSignIn = async (): Promise<void> => {
        try {
        setLoading(true);
        setError('');

        // Step 1: Get Google ID token
        const googleSignInUseCase = sl.getGoogleSignInUseCase();
        const { idToken, email, name } = await googleSignInUseCase.execute();

        // Step 2: Login to backend with Google token
        const googleLoginUseCase = sl.getGoogleLoginUseCase();
        const response = await googleLoginUseCase.execute(idToken);

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
            text2: `Chào mừng ${name}`,
        });

        } catch (error: any) {
        const errorMessage = error.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
        setError(errorMessage);
        console.error('Google Sign-In error:', error);
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
        googleSignIn,
        clearError,
    };
};