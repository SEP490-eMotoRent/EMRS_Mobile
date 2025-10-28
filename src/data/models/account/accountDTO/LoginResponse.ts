export interface LoginResponseData {
    accessToken: string;
    user: {
        id: string;
        username: string;
        role: string;
        fullName: string;
        branchId?: string;
        branchName?: string;
    };
}
