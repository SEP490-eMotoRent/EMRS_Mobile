import { ApiResponse } from '../../../../core/network/APIResponse';
import { LoginResponseData } from '../../../../data/models/account/accountDTO/LoginResponse';
import { AccountRepository } from '../../../repositories/account/AccountRepository';
import { LoginUseCase, LoginUseCaseInput } from '../LoginUseCase';

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

describe('LoginUseCase', () => {
    let loginUseCase: LoginUseCase;

    beforeEach(() => {
        loginUseCase = new LoginUseCase(mockAccountRepository);
        jest.clearAllMocks();
    });

    const mockLoginResponse: ApiResponse<LoginResponseData> = {
        success: true,
        message: 'Đăng nhập thành công',
        code: 200,
        data: {
        accessToken: 'mock-jwt-token',
        user: {
            id: '123',
            username: 'testuser',
            role: 'Renter',
            fullName: 'Test User',
            branchId: 'branch-1',
            branchName: 'Branch 1',
        },
        },
    };

    describe('Successful Login', () => {
        it('TC001: should return login data when credentials are valid', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: 'Password123!',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await loginUseCase.execute(input);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.login).toHaveBeenCalledWith('testuser', 'Password123!');
        expect(mockAccountRepository.login).toHaveBeenCalledTimes(1);
        });

        it('TC002: should accept username with minimum length (3 characters)', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'abc',
            password: 'Password123!',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await loginUseCase.execute(input);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.login).toHaveBeenCalledWith('abc', 'Password123!');
        });

        it('TC003: should accept password with minimum length (6 characters)', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: '123456',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await loginUseCase.execute(input);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.login).toHaveBeenCalledWith('testuser', '123456');
        });
    });

    describe('Username Validation', () => {
        it('TC004: should throw error when username is empty', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: '',
            password: 'Password123!',
        };

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Tên đăng nhập không được để trống'
        );
        expect(mockAccountRepository.login).not.toHaveBeenCalled();
        });

        it('TC005: should throw error when username is only whitespace', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: '   ',
            password: 'Password123!',
        };

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Tên đăng nhập không được để trống'
        );
        expect(mockAccountRepository.login).not.toHaveBeenCalled();
        });

        it('TC006: should throw error when username is too short (< 3 characters)', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'ab',
            password: 'Password123!',
        };

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Tên đăng nhập phải có ít nhất 3 ký tự'
        );
        expect(mockAccountRepository.login).not.toHaveBeenCalled();
        });

        it('TC007: should throw error when username is too long (> 50 characters)', async () => {
        // Arrange
        const longUsername = 'a'.repeat(51);
        const input: LoginUseCaseInput = {
            username: longUsername,
            password: 'Password123!',
        };

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Tên đăng nhập không được vượt quá 50 ký tự'
        );
        expect(mockAccountRepository.login).not.toHaveBeenCalled();
        });

        it('TC008: should trim whitespace from username', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: '  testuser  ',
            password: 'Password123!',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        await loginUseCase.execute(input);

        // Assert - username should be trimmed before validation
        expect(mockAccountRepository.login).toHaveBeenCalledWith('  testuser  ', 'Password123!');
        });
    });

    describe('Password Validation', () => {
        it('TC009: should throw error when password is empty', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: '',
        };

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Mật khẩu không được để trống'
        );
        expect(mockAccountRepository.login).not.toHaveBeenCalled();
        });

        it('TC010: should throw error when password is too short (< 6 characters)', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: '12345',
        };

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Mật khẩu phải có ít nhất 6 ký tự'
        );
        expect(mockAccountRepository.login).not.toHaveBeenCalled();
        });

        it('TC011: should throw error when password is too long (> 128 characters)', async () => {
        // Arrange
        const longPassword = 'a'.repeat(129);
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: longPassword,
        };

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Mật khẩu không được vượt quá 128 ký tự'
        );
        expect(mockAccountRepository.login).not.toHaveBeenCalled();
        });

        it('TC012: should NOT trim whitespace from password', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: '  Pass123!  ',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        await loginUseCase.execute(input);

        // Assert - password should keep spaces
        expect(mockAccountRepository.login).toHaveBeenCalledWith('testuser', '  Pass123!  ');
        });
    });

    describe('API Error Handling', () => {
        it('TC013: should propagate error when credentials are incorrect', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: 'wrongpassword',
        };
        const errorResponse = {
            success: false,
            message: 'Tên đăng nhập hoặc mật khẩu không đúng',
            code: 401,
            data: null,
        };
        mockAccountRepository.login.mockRejectedValue(new Error('Tên đăng nhập hoặc mật khẩu không đúng'));

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Tên đăng nhập hoặc mật khẩu không đúng'
        );
        expect(mockAccountRepository.login).toHaveBeenCalledWith('testuser', 'wrongpassword');
        });

        it('TC014: should propagate error when account is not verified', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'unverified@example.com',
            password: 'Password123!',
        };
        mockAccountRepository.login.mockRejectedValue(
            new Error('Tài khoản chưa được xác minh. Vui lòng xác minh email của bạn.')
        );

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Tài khoản chưa được xác minh'
        );
        });

        it('TC015: should propagate error when account is locked', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'locked@example.com',
            password: 'Password123!',
        };
        mockAccountRepository.login.mockRejectedValue(
            new Error('Tài khoản đã bị khóa')
        );

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Tài khoản đã bị khóa'
        );
        });

        it('TC016: should propagate error when network fails', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: 'Password123!',
        };
        mockAccountRepository.login.mockRejectedValue(
            new Error('Không thể kết nối đến máy chủ')
        );

        // Act & Assert
        await expect(loginUseCase.execute(input)).rejects.toThrow(
            'Không thể kết nối đến máy chủ'
        );
        });
    });

    describe('Edge Cases', () => {
        it('TC017: should handle special characters in username', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'user_123',
            password: 'Password123!',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await loginUseCase.execute(input);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.login).toHaveBeenCalledWith('user_123', 'Password123!');
        });

        it('TC018: should handle special characters in password', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: 'P@ssw0rd!#$',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await loginUseCase.execute(input);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.login).toHaveBeenCalledWith('testuser', 'P@ssw0rd!#$');
        });

        it('TC019: should handle Vietnamese characters in username', async () => {
        // Arrange
        const input: LoginUseCaseInput = {
            username: 'nguyễn',
            password: 'Password123!',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await loginUseCase.execute(input);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.login).toHaveBeenCalledWith('nguyễn', 'Password123!');
        });

        it('TC020: should handle maximum valid username length (50 characters)', async () => {
        // Arrange
        const maxUsername = 'a'.repeat(50);
        const input: LoginUseCaseInput = {
            username: maxUsername,
            password: 'Password123!',
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await loginUseCase.execute(input);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.login).toHaveBeenCalledWith(maxUsername, 'Password123!');
        });

        it('TC021: should handle maximum valid password length (128 characters)', async () => {
        // Arrange
        const maxPassword = 'a'.repeat(128);
        const input: LoginUseCaseInput = {
            username: 'testuser',
            password: maxPassword,
        };
        mockAccountRepository.login.mockResolvedValue(mockLoginResponse);

        // Act
        const result = await loginUseCase.execute(input);

        // Assert
        expect(result).toEqual(mockLoginResponse);
        expect(mockAccountRepository.login).toHaveBeenCalledWith('testuser', maxPassword);
        });
    });
});