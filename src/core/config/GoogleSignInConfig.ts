import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: '261017234655-bfi8r53rch8ekod857vnqe2jlm40l0lu.apps.googleusercontent.com',
        offlineAccess: true,
    });
};