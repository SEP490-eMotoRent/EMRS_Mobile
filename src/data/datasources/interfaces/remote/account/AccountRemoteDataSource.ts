// src/data/datasources/interfaces/remote/account/AccountRemoteDataSource.ts
import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";
import { LoginRequest } from "../../../../models/account/accountDTO/LoginRequest";
import { ApiResponse } from "../../../../../core/network/APIResponse";

export interface AccountRemoteDataSource {
    getByEmail(email: string): Promise<RegisterUserRequest | null>;
    create(request: RegisterUserRequest): Promise<RegisterUserRequest>;
    getAll(): Promise<RegisterUserRequest[]>;
    login(request: LoginRequest): Promise<ApiResponse<string>>;  // ✅ Use ApiResponse
}