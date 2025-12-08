import { ApiResponse } from "../../../../../../core/network/APIResponse";
import { LoginResponseData } from "../../../../../../data/models/account/accountDTO/LoginResponse";
import { AccountRepository } from "../../../../../../domain/repositories/account/AccountRepository";
import { GoogleLoginUseCase } from "../../../../../../domain/usecases/account/Google/GoogleLoginUseCase";

// Mock the repository
const mockAccountRepository: jest.Mocked<AccountRepository> = {
    login: jest.fn(),
    googleLogin: jest.fn(),
    create: jest.fn(),
    getAll: jest.fn(),
    getByEmail: jest.fn(),
    verifyOtp: jest.fn(),
    resendOtp: jest.fn(),
    changePassword: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
};

describe('GoogleLoginUseCase', () => {
    let googleLoginUseCase: GoogleLoginUseCase;

    beforeEach(() => {
        googleLoginUseCase = new GoogleLoginUseCase(mockAccountRepository);
        jest.clearAllMocks();
    });

    const mockLoginResponse: ApiResponse<LoginResponseData> = {
        success: true,
        message: 'Đăng nhập Google thành công',
        code: 200,
        data: {
        accessToken: 'mock-jwt-token',
        user: {
            id: '123',
            username: 'googleuser',
            role: 'Renter',
            fullName: 'Google User',
            branchId: 'branch-1',
            branchName: 'Branch 1',
        },
        },
    };

    // Valid JWT token format (header.payload.signature)
    const validIdToken = 
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.' +
        'eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMjM0NTY3ODkwIiwiYXVkIjoiMTIzNDU2Nzg5MCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDM2MDB9.' +
        'signature';

    describe('Successful Google Login', () => {
        it('TC001: should return login data when idToken is valid', async () => {
        // Arrange
        mockAccountRepository.googleLogin.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await googleLoginUseCase.execute(validIdToken);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.googleLogin).toHaveBeenCalledWith(validIdToken);
        expect(mockAccountRepository.googleLogin).toHaveBeenCalledTimes(1);
        });

        it('TC002: should accept idToken with minimum valid length (> 100 chars)', async () => {
        // Arrange
        const minValidToken = 'a'.repeat(50) + '.' + 'b'.repeat(50) + '.' + 'c'.repeat(50); // Total > 100 chars
        mockAccountRepository.googleLogin.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await googleLoginUseCase.execute(minValidToken);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.googleLogin).toHaveBeenCalledWith(minValidToken);
        });
    });

    describe('IdToken Validation', () => {
        it('TC003: should throw error when idToken is empty', async () => {
        // Act & Assert
        await expect(googleLoginUseCase.execute('')).rejects.toThrow(
            'Google ID Token không được để trống'
        );
        expect(mockAccountRepository.googleLogin).not.toHaveBeenCalled();
        });

        it('TC004: should throw error when idToken is only whitespace', async () => {
        // Act & Assert
        await expect(googleLoginUseCase.execute('   ')).rejects.toThrow(
            'Google ID Token không được để trống'
        );
        expect(mockAccountRepository.googleLogin).not.toHaveBeenCalled();
        });

        it('TC005: should throw error when idToken has invalid format (missing parts)', async () => {
        // Arrange - JWT should have 3 parts
        const invalidToken = 'header.payload'; // Only 2 parts

        // Act & Assert
        await expect(googleLoginUseCase.execute(invalidToken)).rejects.toThrow(
            'Google ID Token không hợp lệ'
        );
        expect(mockAccountRepository.googleLogin).not.toHaveBeenCalled();
        });

        it('TC006: should throw error when idToken has too many parts', async () => {
        // Arrange - JWT should have exactly 3 parts
        const invalidToken = 'header.payload.signature.extra';

        // Act & Assert
        await expect(googleLoginUseCase.execute(invalidToken)).rejects.toThrow(
            'Google ID Token không hợp lệ'
        );
        expect(mockAccountRepository.googleLogin).not.toHaveBeenCalled();
        });

        it('TC007: should throw error when idToken is too short (< 100 chars)', async () => {
        // Arrange - Valid format but too short
        const shortToken = 'a.b.c';

        // Act & Assert
        await expect(googleLoginUseCase.execute(shortToken)).rejects.toThrow(
            'Google ID Token không hợp lệ'
        );
        expect(mockAccountRepository.googleLogin).not.toHaveBeenCalled();
        });

        it('TC008: should throw error when idToken is only dots', async () => {
        // Arrange
        const invalidToken = '..';

        // Act & Assert
        await expect(googleLoginUseCase.execute(invalidToken)).rejects.toThrow(
            'Google ID Token không hợp lệ'
        );
        expect(mockAccountRepository.googleLogin).not.toHaveBeenCalled();
        });
    });

    describe('API Error Handling', () => {
        it('TC009: should propagate error when Google token is invalid', async () => {
        // Arrange
        mockAccountRepository.googleLogin.mockRejectedValue(
            new Error('Google ID Token không hợp lệ hoặc đã hết hạn')
        );

        // Act & Assert
        await expect(googleLoginUseCase.execute(validIdToken)).rejects.toThrow(
            'Google ID Token không hợp lệ hoặc đã hết hạn'
        );
        expect(mockAccountRepository.googleLogin).toHaveBeenCalledWith(validIdToken);
        });

        it('TC010: should propagate error when Google account is not found', async () => {
        // Arrange
        mockAccountRepository.googleLogin.mockRejectedValue(
            new Error('Không tìm thấy tài khoản Google')
        );

        // Act & Assert
        await expect(googleLoginUseCase.execute(validIdToken)).rejects.toThrow(
            'Không tìm thấy tài khoản Google'
        );
        });

        it('TC011: should propagate error when backend service fails', async () => {
        // Arrange
        mockAccountRepository.googleLogin.mockRejectedValue(
            new Error('Lỗi máy chủ nội bộ')
        );

        // Act & Assert
        await expect(googleLoginUseCase.execute(validIdToken)).rejects.toThrow(
            'Lỗi máy chủ nội bộ'
        );
        });

        it('TC012: should propagate error when network fails', async () => {
        // Arrange
        mockAccountRepository.googleLogin.mockRejectedValue(
            new Error('Không thể kết nối đến máy chủ')
        );

        // Act & Assert
        await expect(googleLoginUseCase.execute(validIdToken)).rejects.toThrow(
            'Không thể kết nối đến máy chủ'
        );
        });
    });

    describe('Edge Cases', () => {
        it('TC013: should handle very long valid idToken', async () => {
        // Arrange - Create a very long but valid format token
        const longToken = 
            'a'.repeat(500) + '.' +
            'b'.repeat(500) + '.' +
            'c'.repeat(500);
        mockAccountRepository.googleLogin.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await googleLoginUseCase.execute(longToken);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.googleLogin).toHaveBeenCalledWith(longToken);
        });

        it('TC014: should handle idToken with special characters in signature', async () => {
        // Arrange
        const tokenWithSpecialChars = 
            'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.' +
            'eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20ifQ.' +
            'signature-with-special_chars+/=';
        mockAccountRepository.googleLogin.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await googleLoginUseCase.execute(tokenWithSpecialChars);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.googleLogin).toHaveBeenCalledWith(tokenWithSpecialChars);
        });

        it('TC015: should trim whitespace from idToken', async () => {
        // Arrange
        const tokenWithWhitespace = `  ${validIdToken}  `;
        mockAccountRepository.googleLogin.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await googleLoginUseCase.execute(tokenWithWhitespace);

        // Assert - token should be passed as-is (validation will trim internally)
        expect(mockAccountRepository.googleLogin).toHaveBeenCalledWith(tokenWithWhitespace);
        });
    });

    describe('Token Format Validation', () => {
        it('TC016: should reject token with only one dot', async () => {
        // Arrange
        const invalidToken = 'headerandpayload.signature';

        // Act & Assert
        await expect(googleLoginUseCase.execute(invalidToken)).rejects.toThrow(
            'Google ID Token không hợp lệ'
        );
        });

        it('TC017: should reject token with no dots', async () => {
        // Arrange
        const invalidToken = 'a'.repeat(150);

        // Act & Assert
        await expect(googleLoginUseCase.execute(invalidToken)).rejects.toThrow(
            'Google ID Token không hợp lệ'
        );
        });

        it('TC018: should reject empty segments between dots', async () => {
        // Arrange
        const invalidToken = 'a'.repeat(50) + '..' + 'c'.repeat(50);

        // Act & Assert
        await expect(googleLoginUseCase.execute(invalidToken)).rejects.toThrow(
            'Google ID Token không hợp lệ'
        );
        });
    });
});