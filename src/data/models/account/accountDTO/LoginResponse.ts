export interface LoginResponseData {
    accessToken: string;
    user: {
        role: string;
        fullName: string;
    };
}
