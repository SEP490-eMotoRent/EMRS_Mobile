// src/data/mappers/WithdrawalRequestMapper.ts
import { Wallet } from "../../domain/entities/financial/Wallet";
import { WithdrawalRequest } from "../../domain/entities/financial/WithdrawalRequest";
import { WithdrawalRequestDetailResponse } from "../models/withdrawRequest/WithdrawalRequestDetailResponse";
import { WithdrawalRequestResponse } from "../models/withdrawRequest/WithdrawalRequestResponse";

export class WithdrawalRequestMapper {
    static toDomain(dto: WithdrawalRequestResponse): WithdrawalRequest {
        // Create placeholder wallet with correct constructor signature
        const placeholderWallet = new Wallet(
            "",           // id
            "",           // renterId
            null as any,  // renter
            0,            // balance
            [],           // withdrawalRequests
            new Date(),   // createdAt
            null,         // updatedAt
            null,         // deletedAt
            false         // isDeleted
        );

        return new WithdrawalRequest(
            dto.id,
            dto.amount,
            dto.bankName,
            dto.bankAccountNumber,
            dto.bankAccountName,
            dto.status,
            dto.rejectionReason || "",
            "",
            placeholderWallet,
            dto.processedAt ? new Date(dto.processedAt) : undefined,
            new Date(dto.createdAt),
            null,
            null,
            false
        );
    }

    static toDetailDomain(
        dto: WithdrawalRequestDetailResponse
    ): WithdrawalRequest {
        // Create wallet from DTO with correct constructor signature
        const wallet = new Wallet(
            dto.wallet.id,
            dto.wallet.renterId,
            null as any,  // renter - not provided in DTO
            dto.wallet.balance,
            [],           // withdrawalRequests
            new Date(),
            null,
            null,
            false
        );

        return new WithdrawalRequest(
            dto.id,
            dto.amount,
            dto.bankName,
            dto.bankAccountNumber,
            dto.bankAccountName,
            dto.status,
            dto.rejectionReason || "",
            dto.walletId,
            wallet,
            dto.processedAt ? new Date(dto.processedAt) : undefined,
            new Date(dto.createdAt),
            null,
            null,
            false
        );
    }

    static toDomainList(
        dtos: WithdrawalRequestResponse[]
    ): WithdrawalRequest[] {
        return dtos.map((dto) => this.toDomain(dto));
    }
}