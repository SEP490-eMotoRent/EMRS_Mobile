// src/data/datasources/interfaces/remote/account/AccountRemoteDataSource.ts
import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";
import { LoginRequest } from "../../../../models/account/accountDTO/LoginRequest";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { LoginResponseData } from "../../../../models/account/accountDTO/LoginResponse";

export interface AccountRemoteDataSource {
    getByEmail(email: string): Promise<RegisterUserRequest | null>;
    create(request: RegisterUserRequest): Promise<RegisterUserRequest>;
    getAll(): Promise<RegisterUserRequest[]>;
    login(request: LoginRequest): Promise<ApiResponse<LoginResponseData>>;  // ✅ Use ApiResponse
}