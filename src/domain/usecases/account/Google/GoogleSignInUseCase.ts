import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface GoogleSignInResult {
    idToken: string;
    email: string;
    name: string;
    photo?: string;
}

export class GoogleSignInUseCase {
    async execute(): Promise<GoogleSignInResult> {
        try {
        await GoogleSignin.hasPlayServices();
        
        const result = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        
        return {
            idToken: tokens.idToken,
            email: (result as any).data?.email || '',
            name: (result as any).data?.name || '',
            photo: (result as any).data?.photo || undefined,
        };
        } catch (error: any) {
        throw new Error(error.message || 'Google Sign-In failed');
        }
    }
}