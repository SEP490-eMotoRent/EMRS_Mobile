/**
 * UPDATE YOUR AccountModule.ts to expose RegisterUseCase
 * 
 * Location: src/core/di/modules/AccountModule.ts
 */

import { AxiosClient } from '../../network/AxiosClient';
import { AccountRepositoryImpl } from '../../../data/repositories/account/AccountRepositoryImpl';
import { LoginUseCase } from '../../../domain/usecases/account/LoginUseCase';
import { RegisterUseCase } from '../../../domain/usecases/account/RegisterUseCase';
import { AccountRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/account/AccountRemoteDataSourceImpl';
import { GoogleLoginUseCase } from '../../../domain/usecases/account/Google/GoogleLoginUseCase';
import { GoogleSignInUseCase } from '../../../domain/usecases/account/Google/GoogleSignInUseCase';


export class AccountModule {
  private _repository: AccountRepositoryImpl | null = null;
  private _registerUseCase: RegisterUseCase | null = null;  // ✅ ADD THIS
  private _loginUseCase: LoginUseCase | null = null;
  private _googleSignInUseCase: GoogleSignInUseCase | null = null;
  private _googleLoginUseCase: GoogleLoginUseCase | null = null;

  constructor(private axiosClient: AxiosClient) {}

  static create(axiosClient: AxiosClient): AccountModule {
    return new AccountModule(axiosClient);
  }

  get repository(): AccountRepositoryImpl {
    if (!this._repository) {
      const remoteDataSource = new AccountRemoteDataSourceImpl(this.axiosClient);
      this._repository = new AccountRepositoryImpl(remoteDataSource);
    }
    return this._repository;
  }

  get useCases() {
    return {
      register: this.registerUseCase,  // ✅ ADD THIS
      login: this.loginUseCase,
    };
  }

  get auth() {
    return {
      googleSignIn: this.googleSignInUseCase,
      googleLogin: this.googleLoginUseCase,
    };
  }

  // ✅ ADD THIS GETTER
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
}

/**
 * SUMMARY OF CHANGES:
 * 
 * 1. Added private _registerUseCase property
 * 2. Added registerUseCase getter that creates RegisterUseCase with repository
 * 3. Exposed it in useCases getter as 'register'
 * 
 * Now you can call:
 * container.account.useCases.register.execute({...})
 */