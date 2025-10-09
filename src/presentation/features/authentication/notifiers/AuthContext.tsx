import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState } from './AuthState';

// Define the context type
interface AuthContextType {
    authState: AuthState;
    login: (phone: string) => Promise<void>;
    signup: (email: string, password: string, confirmPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({ type: 'initial' });

    const login = async (phone: string) => {
        setAuthState({ type: 'loading' });
        try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!phone) {
            throw new Error('Phone number cannot be empty');
        }
        setAuthState({ type: 'success' });
        } catch (e) {
        setAuthState({ type: 'error', message: e instanceof Error ? e.message : 'Unknown error' });
        }
    };

    const signup = async (email: string, password: string, confirmPassword: string) => {
        setAuthState({ type: 'loading' });
        try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        setAuthState({ type: 'success' });
        } catch (e) {
        setAuthState({ type: 'error', message: e instanceof Error ? e.message : 'Unknown error' });
        }
    };

    return (
        <AuthContext.Provider value={{ authState, login, signup }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};