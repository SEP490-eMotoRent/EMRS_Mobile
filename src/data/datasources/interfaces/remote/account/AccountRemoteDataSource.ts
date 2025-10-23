import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";

export interface AccountRemoteDataSource {
    getByEmail(email: string): Promise<RegisterUserRequest | null>;
    create(request: RegisterUserRequest): Promise<RegisterUserRequest>;
    getAll(): Promise<RegisterUserRequest[]>;
}