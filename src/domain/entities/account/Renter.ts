import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";

import { Account } from "./Account";
import { Wallet } from "../financial/Wallet";
import { Document } from "./Document";
import { Booking } from "../booking/Booking";
import { Feedback } from "../booking/Feedback";
import { InsuranceClaim } from "../insurance/InsuranceClaim";
import { Membership } from "../financial/Membership";
export class Renter implements BaseEntity {
  public readonly id: string;
  public createdAt: Date;
  public updatedAt: Date | null;
  public deletedAt: Date | null;
  public isDeleted: boolean;

  public email: string;
  public phone: string;
  public address: string;
  public dateOfBirth?: string;
  public avatarUrl: string = "";
  public accountId: string;
  public membershipId: string;
  public isVerified: boolean = false;
  public verificationCode: string = "";
  public verificationCodeExpiry?: Date;

  // Relations - optional, filled later
  public account?: Account;
  public membership?: Membership;
  public wallet?: Wallet;
  public documents: Document[] = [];
  public bookings: Booking[] = [];
  public feedbacks: Feedback[] = [];
  public insuranceClaims: InsuranceClaim[] = [];

  constructor(
    id: string,
    email: string,
    phone: string,
    address: string,
    accountId: string,
    membershipId: string,
    isVerified: boolean = false,
    verificationCode: string = "",
    dateOfBirth?: string,
    verificationCodeExpiry?: Date,
    avatarUrl?: string,
    wallet?: Wallet,
    account?: Account,
    createdAt: Date = new Date(),
    updatedAt: Date | null = null,
    deletedAt: Date | null = null,
    isDeleted: boolean = false
  ) {
    this.id = id;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.accountId = accountId;
    this.membershipId = membershipId;
    this.isVerified = isVerified;
    this.verificationCode = verificationCode;
    this.dateOfBirth = dateOfBirth;
    this.verificationCodeExpiry = verificationCodeExpiry;
    this.avatarUrl = avatarUrl || "";
    this.wallet = wallet;
    this.account = account;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.isDeleted = isDeleted;
  }

  fullName(): string {
    return this.account?.fullname || this.email.split("@")[0] || "User";
  }

  // Optional: attach later
  attachAccount(account: Account): void {
    this.account = account;
  }

  attachMembership(membership: Membership): void {
    this.membership = membership;
  }
}

export type CreateRenterInput = CreateEntityInput<Renter>;
export type UpdateRenterInput = UpdateEntityInput<Renter>;