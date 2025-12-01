export interface ChangePasswordRequest {
    accountId: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}