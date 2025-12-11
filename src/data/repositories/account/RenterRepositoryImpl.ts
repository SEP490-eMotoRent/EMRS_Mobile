import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../../../domain/entities/account/Account";
import { Renter } from "../../../domain/entities/account/Renter";
import { Membership } from "../../../domain/entities/financial/Membership";
import { RenterLocalDataSource } from "../../datasources/interfaces/local/account/RenterLocalDataSource";
import { RenterRemoteDataSource } from "../../datasources/interfaces/remote/account/RenterRemoteDataSource";
import { RegisterRenterResponse } from "../../models/account/renter/RegisterRenterResponse";
import { RenterResponse } from "../../models/account/renter/RenterResponse";

import { RenterRepository } from "../../../domain/repositories/account/RenterRepository";
import { ScanFaceRequest } from "../../models/account/renter/ScanFaceRequest";
import { ScanFaceResponse } from "../../models/account/renter/ScanFaceResponse";
import { ApiResponse } from "../../../core/network/APIResponse";
import { UpdateRenterRequest } from "../../models/account/renter/update/UpdateRenterRequest";
import { UpdateRenterResponse } from "../../models/account/renter/update/RenterAccountUpdateResponse";
import { GetRenterByCitizenIdResponse } from "../../models/account/renter/GetRenterByCitizenIdResponse";

export class RenterRepositoryImpl implements RenterRepository {
  constructor(
    private local: RenterLocalDataSource,
    private remote: RenterRemoteDataSource
  ) {}

  async create(renter: Renter): Promise<void> {
    const model: RegisterRenterResponse = {
      id: renter.id,
      email: renter.email,
      phone: renter.phone,
      address: renter.address,
      dateOfBirth: renter.dateOfBirth,
      avatarUrl: renter.avatarUrl,
      accountId: renter.accountId,
      membershipId: renter.membershipId,
      verificationCodeExpiry: renter.verificationCodeExpiry?.toISOString(),
    };
    const renters = await this.local.getAll();
    renters.push(model);
    await AsyncStorage.setItem('@renters', JSON.stringify(renters));
  }

  async getAll(): Promise<Renter[]> {
    const models = await this.local.getAll();
    return models.map((model) => this.mapToEntity(model));
  }

  async getCurrentRenter(): Promise<Renter> {
    const response = await this.remote.getCurrent();
    return this.mapRenterResponseToEntity(response);
  }

  async getCurrentRenterRaw(): Promise<RenterResponse> {
    return await this.remote.getCurrent();
  }

  async getById(id: string): Promise<RenterResponse | null> {
    return await this.remote.getById(id);
  }

  async update(request: UpdateRenterRequest): Promise<UpdateRenterResponse> {
    return await this.remote.update(request);
  }

  async scanFace(request: ScanFaceRequest): Promise<ApiResponse<ScanFaceResponse>> {
    return await this.remote.scanFace(request);
  }

  async getByCitizenId(citizenId: string): Promise<ApiResponse<GetRenterByCitizenIdResponse>> {
    return await this.remote.getByCitizenId(citizenId);
  }

  // Updated to handle new avatar object format
  private mapRenterResponseToEntity(response: RenterResponse): Renter {
    const account = new Account(
      response.account.id,
      response.account.username,
      "",
      response.account.role,
      response.account.fullname || "",
      undefined,
      undefined,
      false,
      undefined,
      undefined,
      null,
      undefined,
      new Date(),
      null,
      null,
      false
    );

    let membership: Membership;
    if (response.membership) {
      membership = new Membership(
        response.membership.id,
        response.membership.tierName,
        response.membership.minBookings,
        response.membership.discountPercentage,
        0,
        response.membership.description,
        [],
        new Date(response.membership.createdAt),
        response.membership.updatedAt ? new Date(response.membership.updatedAt) : null,
        null,
        false
      );
    } else {
      membership = new Membership("", "BRONZE", 0, 0, 0, "Hạng thành viên mới", [], new Date(), null, null, false);
    }

    let dateOfBirth = response.dateOfBirth;
    if (response.dateOfBirth && response.dateOfBirth.includes("/")) {
      const [day, month, year] = response.dateOfBirth.split("/");
      dateOfBirth = `${year}-${month}-${day}`;
    }

    const hasCitizenDoc = response.documents.some(
      (doc) => doc.documentType === "Citizen" && doc.verificationStatus === "Verified"
    );

    // Handle both old string and new object avatar
    const avatarUrl = typeof response.avatar === 'string' 
      ? response.avatar 
      : response.avatar?.fileUrl || "";

    const renter = new Renter(
      response.id,
      response.email,
      response.phone,
      response.address,
      response.account.id,
      response.membership?.id || "",
      hasCitizenDoc,
      "",
      dateOfBirth,
      undefined,
      avatarUrl,
      undefined,
      account,
      new Date(),
      null,
      null,
      false
    );

    renter.attachMembership(membership);
    return renter;
  }

  private mapToEntity(model: RegisterRenterResponse): Renter {
    const account = new Account(
      model.accountId,
      `user_${model.accountId}`,
      'password123',
      'Renter',
      `User ${model.accountId}`,
      undefined, undefined, false, undefined, undefined,
      null, undefined, new Date(), null, null, false
    );

    const membership = new Membership(
      model.membershipId || "",
      'Basic',
      0, 0, 0, 'Basic membership',
      [],
      new Date(), null, null, false
    );

    const renter = new Renter(
      model.id,
      model.email,
      model.phone,
      model.address,
      model.accountId,
      model.membershipId || "",
      false,
      '',
      model.dateOfBirth,
      model.verificationCodeExpiry ? new Date(model.verificationCodeExpiry) : undefined,
      model.avatarUrl || "",
      undefined,
      account,
      new Date(),
      null,
      null,
      false
    );

    renter.attachMembership(membership);
    return renter;
  }
}