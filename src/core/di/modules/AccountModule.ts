import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { AccountRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/account/AccountRemoteDataSourceImpl';
import { AccountLocalDataSourceImpl } from '../../../data/datasources/implementations/local/account/AccountLocalDataSourceImpl';
import { RenterRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/account/RenterRemoteDataSourceImpl';
import { RenterLocalDataSourceImpl } from '../../../data/datasources/implementations/local/account/RenterLocalDataSourceImpl';
import { DocumentRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/account/DocumentRemoteDataSourceImpl';

// Repositories
import { AccountRepositoryImpl } from '../../../data/repositories/account/AccountRepositoryImpl';
import { RenterRepositoryImpl } from '../../../data/repositories/account/RenterRepositoryImpl';
import { DocumentRepositoryImpl } from '../../../data/repositories/account/DocumentRepositoryImpl';

// Use Cases - Authentication
import { RegisterUseCase } from '../../../domain/usecases/account/RegisterUseCase';
import { LoginUseCase } from '../../../domain/usecases/account/LoginUseCase';
import { GoogleSignInUseCase } from '../../../domain/usecases/account/Google/GoogleSignInUseCase';
import { GoogleLoginUseCase } from '../../../domain/usecases/account/Google/GoogleLoginUseCase';

// Use Cases - OTP
import { VerifyOtpUseCase } from '../../../domain/usecases/account/OTP/VerifyOtpUseCase';
import { ResendOtpUseCase } from '../../../domain/usecases/account/OTP/ResendOtpUseCase';

// Use Cases - Passwords
import { ChangePasswordUseCase } from '../../../domain/usecases/account/Passwords/ChangePasswordUseCase';
import { ForgotPasswordUseCase } from '../../../domain/usecases/account/Passwords/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../../domain/usecases/account/Passwords/ResetPasswordUseCase';

// Use Cases - Profile
import { GetCurrentRenterUseCase } from '../../../domain/usecases/account/Profile/GetCurrentRenterUseCase';
import { UpdateRenterProfileUseCase } from '../../../domain/usecases/account/Profile/UpdateRenterProfileUseCase';

// Use Cases - Documents
import { CreateCitizenDocumentUseCase } from '../../../domain/usecases/account/Documents/IdentificationCard/CreateCitizenDocumentUseCase';
import { UpdateCitizenDocumentUseCase } from '../../../domain/usecases/account/Documents/IdentificationCard/UpdateCitizenDocumentUseCase';
import { CreateDrivingDocumentUseCase } from '../../../domain/usecases/account/Documents/DriverLicense/CreateDrivingDocumentUseCase';
import { UpdateDrivingDocumentUseCase } from '../../../domain/usecases/account/Documents/DriverLicense/UpdateDrivingDocumentUseCase';
import { DeleteDocumentUseCase } from '../../../domain/usecases/account/Documents/DeleteDocumentUseCase';

/**
 * AccountModule - Complete Account Domain
 * 
 * Handles all account-related functionality:
 * - Authentication (Login, Register, Google OAuth)
 * - OTP verification and resend
 * - Password management (Change, Forgot, Reset)
 * - Renter profile management
 * - Document management (ID cards, driver licenses)
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class AccountModule {
    // ==================== REPOSITORIES ====================
    private _accountRepository: AccountRepositoryImpl | null = null;
    private _renterRepository: RenterRepositoryImpl | null = null;
    private _documentRepository: DocumentRepositoryImpl | null = null;

    // ==================== DATA SOURCES ====================
    private _accountLocalDataSource: AccountLocalDataSourceImpl | null = null;
    private _renterLocalDataSource: RenterLocalDataSourceImpl | null = null;

    // ==================== USE CASES - AUTHENTICATION ====================
    private _registerUseCase: RegisterUseCase | null = null;
    private _loginUseCase: LoginUseCase | null = null;
    private _googleSignInUseCase: GoogleSignInUseCase | null = null;
    private _googleLoginUseCase: GoogleLoginUseCase | null = null;

    // ==================== USE CASES - OTP ====================
    private _verifyOtpUseCase: VerifyOtpUseCase | null = null;
    private _resendOtpUseCase: ResendOtpUseCase | null = null;

    // ==================== USE CASES - PASSWORDS ====================
    private _changePasswordUseCase: ChangePasswordUseCase | null = null;
    private _forgotPasswordUseCase: ForgotPasswordUseCase | null = null;
    private _resetPasswordUseCase: ResetPasswordUseCase | null = null;

    // ==================== USE CASES - PROFILE ====================
    private _getCurrentRenterUseCase: GetCurrentRenterUseCase | null = null;
    private _updateRenterProfileUseCase: UpdateRenterProfileUseCase | null = null;

    // ==================== USE CASES - DOCUMENTS ====================
    private _createCitizenDocumentUseCase: CreateCitizenDocumentUseCase | null = null;
    private _updateCitizenDocumentUseCase: UpdateCitizenDocumentUseCase | null = null;
    private _createDrivingDocumentUseCase: CreateDrivingDocumentUseCase | null = null;
    private _updateDrivingDocumentUseCase: UpdateDrivingDocumentUseCase | null = null;
    private _deleteDocumentUseCase: DeleteDocumentUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): AccountModule {
        return new AccountModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get repository(): AccountRepositoryImpl {
        if (!this._accountRepository) {
        const remoteDataSource = new AccountRemoteDataSourceImpl(this.axiosClient);
        this._accountRepository = new AccountRepositoryImpl(remoteDataSource);
        }
        return this._accountRepository;
    }

    get renterRepository(): RenterRepositoryImpl {
        if (!this._renterRepository) {
        const remoteDataSource = new RenterRemoteDataSourceImpl(this.axiosClient);
        this._renterRepository = new RenterRepositoryImpl(
            this.renterLocalDataSource,
            remoteDataSource
        );
        }
        return this._renterRepository;
    }

    get documentRepository(): DocumentRepositoryImpl {
        if (!this._documentRepository) {
        const remoteDataSource = new DocumentRemoteDataSourceImpl(this.axiosClient);
        this._documentRepository = new DocumentRepositoryImpl(remoteDataSource);
        }
        return this._documentRepository;
    }

    // ==================== PUBLIC API - LOCAL DATA SOURCES ====================

    get accountLocalDataSource(): AccountLocalDataSourceImpl {
        if (!this._accountLocalDataSource) {
        this._accountLocalDataSource = new AccountLocalDataSourceImpl();
        }
        return this._accountLocalDataSource;
    }

    get renterLocalDataSource(): RenterLocalDataSourceImpl {
        if (!this._renterLocalDataSource) {
        this._renterLocalDataSource = new RenterLocalDataSourceImpl();
        }
        return this._renterLocalDataSource;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Authentication use cases
     * Usage: container.account.useCases.register.execute()
     */
    get useCases() {
        return {
        register: this.registerUseCase,
        login: this.loginUseCase,
        };
    }

    /**
     * Google OAuth use cases
     * Usage: container.account.auth.googleSignIn.execute()
     */
    get auth() {
        return {
        googleSignIn: this.googleSignInUseCase,
        googleLogin: this.googleLoginUseCase,
        };
    }

    /**
     * OTP use cases
     * Usage: container.account.otp.verify.execute()
     */
    get otp() {
        return {
        verify: this.verifyOtpUseCase,
        resend: this.resendOtpUseCase,
        };
    }

    /**
     * Password management use cases
     * Usage: container.account.passwords.change.execute()
     */
    get passwords() {
        return {
        change: this.changePasswordUseCase,
        forgot: this.forgotPasswordUseCase,
        reset: this.resetPasswordUseCase,
        };
    }

    /**
     * Profile management use cases
     * Usage: container.account.profile.getCurrent.execute()
     */
    get profile() {
        return {
        getCurrent: this.getCurrentRenterUseCase,
        update: this.updateRenterProfileUseCase,
        };
    }

    /**
     * Document management use cases
     * Usage: container.account.documents.citizen.create.execute()
     */
    get documents() {
        return {
        citizen: {
            create: this.createCitizenDocumentUseCase,
            update: this.updateCitizenDocumentUseCase,
        },
        driving: {
            create: this.createDrivingDocumentUseCase,
            update: this.updateDrivingDocumentUseCase,
        },
        delete: this.deleteDocumentUseCase,
        };
    }

    // ==================== PRIVATE GETTERS - AUTHENTICATION ====================

    private get registerUseCase(): RegisterUseCase {
        if (!this._registerUseCase) {
        this._registerUseCase = new RegisterUseCase(this.repository);
        }
        return this._registerUseCase;
    }

    private get loginUseCase(): LoginUseCase {
        if (!this._loginUseCase) {
        this._loginUseCase = new LoginUseCase(this.repository);
        }
        return this._loginUseCase;
    }

    private get googleSignInUseCase(): GoogleSignInUseCase {
        if (!this._googleSignInUseCase) {
        this._googleSignInUseCase = new GoogleSignInUseCase();
        }
        return this._googleSignInUseCase;
    }

    private get googleLoginUseCase(): GoogleLoginUseCase {
        if (!this._googleLoginUseCase) {
        this._googleLoginUseCase = new GoogleLoginUseCase(this.repository);
        }
        return this._googleLoginUseCase;
    }

    // ==================== PRIVATE GETTERS - OTP ====================

    private get verifyOtpUseCase(): VerifyOtpUseCase {
        if (!this._verifyOtpUseCase) {
        this._verifyOtpUseCase = new VerifyOtpUseCase(this.repository);
        }
        return this._verifyOtpUseCase;
    }

    private get resendOtpUseCase(): ResendOtpUseCase {
        if (!this._resendOtpUseCase) {
        this._resendOtpUseCase = new ResendOtpUseCase(this.repository);
        }
        return this._resendOtpUseCase;
    }

    // ==================== PRIVATE GETTERS - PASSWORDS ====================

    private get changePasswordUseCase(): ChangePasswordUseCase {
        if (!this._changePasswordUseCase) {
        this._changePasswordUseCase = new ChangePasswordUseCase(this.repository);
        }
        return this._changePasswordUseCase;
    }

    private get forgotPasswordUseCase(): ForgotPasswordUseCase {
        if (!this._forgotPasswordUseCase) {
        this._forgotPasswordUseCase = new ForgotPasswordUseCase(this.repository);
        }
        return this._forgotPasswordUseCase;
    }

    private get resetPasswordUseCase(): ResetPasswordUseCase {
        if (!this._resetPasswordUseCase) {
        this._resetPasswordUseCase = new ResetPasswordUseCase(this.repository);
        }
        return this._resetPasswordUseCase;
    }

    // ==================== PRIVATE GETTERS - PROFILE ====================

    private get getCurrentRenterUseCase(): GetCurrentRenterUseCase {
        if (!this._getCurrentRenterUseCase) {
        this._getCurrentRenterUseCase = new GetCurrentRenterUseCase(this.renterRepository);
        }
        return this._getCurrentRenterUseCase;
    }

    private get updateRenterProfileUseCase(): UpdateRenterProfileUseCase {
        if (!this._updateRenterProfileUseCase) {
        this._updateRenterProfileUseCase = new UpdateRenterProfileUseCase(this.renterRepository);
        }
        return this._updateRenterProfileUseCase;
    }

    // ==================== PRIVATE GETTERS - DOCUMENTS ====================

    private get createCitizenDocumentUseCase(): CreateCitizenDocumentUseCase {
        if (!this._createCitizenDocumentUseCase) {
        this._createCitizenDocumentUseCase = new CreateCitizenDocumentUseCase(this.documentRepository);
        }
        return this._createCitizenDocumentUseCase;
    }

    private get updateCitizenDocumentUseCase(): UpdateCitizenDocumentUseCase {
        if (!this._updateCitizenDocumentUseCase) {
        this._updateCitizenDocumentUseCase = new UpdateCitizenDocumentUseCase(this.documentRepository);
        }
        return this._updateCitizenDocumentUseCase;
    }

    private get createDrivingDocumentUseCase(): CreateDrivingDocumentUseCase {
        if (!this._createDrivingDocumentUseCase) {
        this._createDrivingDocumentUseCase = new CreateDrivingDocumentUseCase(this.documentRepository);
        }
        return this._createDrivingDocumentUseCase;
    }

    private get updateDrivingDocumentUseCase(): UpdateDrivingDocumentUseCase {
        if (!this._updateDrivingDocumentUseCase) {
        this._updateDrivingDocumentUseCase = new UpdateDrivingDocumentUseCase(this.documentRepository);
        }
        return this._updateDrivingDocumentUseCase;
    }

    private get deleteDocumentUseCase(): DeleteDocumentUseCase {
        if (!this._deleteDocumentUseCase) {
        this._deleteDocumentUseCase = new DeleteDocumentUseCase(this.documentRepository);
        }
        return this._deleteDocumentUseCase;
    }
}