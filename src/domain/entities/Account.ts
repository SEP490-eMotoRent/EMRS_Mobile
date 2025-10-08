export enum UserRole {
    Renter = 'renter',
    Staff = 'staff',
    Manager = 'manager',
    Admin = 'admin',
    Technician = 'technician',
}

export class Account {
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

    equals(other: any): boolean {
        if (!(other instanceof Account)) return false;
        return (
        this.id === other.id &&
        this.username === other.username &&
        this.role === other.role &&
        this.fullName === other.fullName &&
        this.isActive === other.isActive &&
        this.createdAt.getTime() === other.createdAt.getTime() &&
        this.lastLogin?.getTime() === other.lastLogin?.getTime()
        );
    }

    get props(): any[] {
        return [
        this.id,
        this.username,
        this.role,
        this.fullName,
        this.isActive,
        this.createdAt,
        this.lastLogin,
        ];
    }
}