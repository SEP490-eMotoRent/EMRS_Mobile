import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";
import { Renter } from "./Renter";
import { Staff } from "./Staff";

export class Account implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public username: string;
    public password: string;
    public role: string;
    public fullname?: string;
    public refreshToken?: string;
    public refreshTokenExpiry?: Date;
    public isRefreshTokenRevoked: boolean;
    public resetPasswordToken?: string;
    public resetPasswordTokenExpiry?: Date;

    public renter?: Renter;
    public staff?: Staff;

    constructor(
        id: string,
        username: string,
        password: string,
        role: string,
        fullname?: string,
        refreshToken?: string,
        refreshTokenExpiry?: Date,
        isRefreshTokenRevoked: boolean = false,
        resetPasswordToken?: string,
        resetPasswordTokenExpiry?: Date,
        renter?: Renter,
        staff?: Staff,
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;

        // Required fields
        this.username = username;
        this.password = password;
        this.role = role;
        this.isRefreshTokenRevoked = isRefreshTokenRevoked;

        // Optional fields
        this.fullname = fullname;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiry = refreshTokenExpiry;
        this.resetPasswordToken = resetPasswordToken;
        this.resetPasswordTokenExpiry = resetPasswordTokenExpiry;
        
        this.renter = renter;
        this.staff = staff;
    }

    // C# METHODS - EXACT MATCH
    isAdmin(): boolean { return this.role === 'Admin'; }
    isStaff(): boolean { return this.role === 'Staff'; }
    isManager(): boolean { return this.role === 'Manager'; }
    isRenter(): boolean { return this.role === 'Renter'; }
    isTechnician(): boolean { return this.role === 'Technician'; }

    delete(): void {
        this.updatedAt = new Date();
        this.deletedAt = new Date();
        this.isDeleted = true;
    }

    restore(): void {
        this.updatedAt = new Date();
        this.deletedAt = null;
        this.isDeleted = false;
    }
}

export type CreateAccountInput = CreateEntityInput<Account>;
export type UpdateAccountInput = UpdateEntityInput<Account>;