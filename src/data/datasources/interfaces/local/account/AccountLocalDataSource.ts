import { RegisterUserRequest } from "../../../../models/account/accountDTO/RegisterUserRequest";

export interface AccountLocalDataSource {
    getByEmail(email: string): Promise<RegisterUserRequest | null>;
    create(request: RegisterUserRequest): Promise<RegisterUserRequest>;
    getAll(): Promise<RegisterUserRequest[]>;
    update(id: string, account: RegisterUserRequest): Promise<void>;
    delete(id: string): Promise<void>;
}