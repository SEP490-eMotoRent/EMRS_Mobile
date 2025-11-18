// src/data/datasources/interfaces/remote/account/AccountRemoteDataSource.ts
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { GoogleLoginRequest } from "../../../../models/account/accountDTO/GoogleLoginRequest";
import { LoginRequest } from "../../../../models/account/accountDTO/LoginRequest";
import { LoginResponseData } from "../../../../models/account/accountDTO/LoginResponse";
import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";

export interface AccountRemoteDataSource {
    getByEmail(email: string): Promise<RegisterUserRequest | null>;
    create(request: RegisterUserRequest): Promise<RegisterUserRequest>;
    getAll(): Promise<RegisterUserRequest[]>;
    login(request: LoginRequest): Promise<ApiResponse<LoginResponseData>>;
    googleLogin(request: GoogleLoginRequest): Promise<ApiResponse<LoginResponseData>>;
}