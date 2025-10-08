import { parseISO } from 'date-fns';
import { Account, UserRole } from '../../domain/entities/Account';

export class AccountModel {
    readonly id: string;
    readonly username: string;
    readonly passwordHash: string;
    readonly role: UserRole;
    readonly fullName: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly lastLogin?: Date | null;

    constructor({
        id,
        username,
        passwordHash,
        role,
        fullName,
        isActive,
        createdAt,
        lastLogin,
    }: {
        id: string;
        username: string;
        passwordHash: string;
        role: UserRole;
        fullName: string;
        isActive: boolean;
        createdAt: Date;
        lastLogin?: Date | null;
    }) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.fullName = fullName;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
    }

    static fromJson(json: Record<string, any>): AccountModel {
        return new AccountModel({
        id: json['account_id'] ?? '',
        username: json['username'] ?? '',
        passwordHash: json['password_hash'] ?? '',
        role: this.roleFromString(json['role']),
        fullName: json['full_name'] ?? '',
        isActive: json['is_active'] ?? false,
        createdAt: json['created_at'] ? parseISO(json['created_at']) : new Date(),
        lastLogin: json['last_login'] ? parseISO(json['last_login']) : null,
        });
    }

    toJson(): Record<string, any> {
        return {
        account_id: this.id,
        username: this.username,
        password_hash: this.passwordHash,
        role: this.role,
        full_name: this.fullName,
        is_active: this.isActive,
        created_at: this.createdAt.toISOString(),
        last_login: this.lastLogin ? this.lastLogin.toISOString() : null,
        };
    }

    toEntity(): Account {
        return new Account({
        id: this.id,
        username: this.username,
        passwordHash: this.passwordHash,
        role: this.role,
        fullName: this.fullName,
        isActive: this.isActive,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin,
        });
    }

    static fromEntity(entity: Account): AccountModel {
        return new AccountModel({
        id: entity.id,
        username: entity.username,
        passwordHash: entity.passwordHash,
        role: entity.role,
        fullName: entity.fullName,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
        lastLogin: entity.lastLogin,
        });
    }

    private static roleFromString(role?: string): UserRole {
        if (!role) return UserRole.Renter;
        return (
        Object.values(UserRole).find(r => r === role || r === role.split('.').pop()) ??
        UserRole.Renter
        );
    }

    equals(other: any): boolean {
        if (!(other instanceof AccountModel)) return false;
        return (
        this.id === other.id &&
        this.username === other.username &&
        this.role === other.role &&
        this.fullName === other.fullName &&
        this.isActive === other.isActive
        );
    }

    get props(): any[] {
        return [this.id, this.username, this.role, this.fullName, this.isActive];
    }
}