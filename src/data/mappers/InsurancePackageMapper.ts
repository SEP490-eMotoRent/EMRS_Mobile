import { InsurancePackage } from "../../domain/entities/insurance/InsurancePackage";
import { InsurancePackageResponse } from "../models/booking/BookingResponse";

export class InsurancePackageMapper {
    /**
     * Map DTO to Domain Entity
     */
    static toDomain(dto: InsurancePackageResponse): InsurancePackage {
        return new InsurancePackage(
            dto.id,
            dto.packageName,
            dto.packageFee,
            dto.coveragePersonLimit,
            dto.coveragePropertyLimit,
            dto.coverageVehiclePercentage,
            dto.coverageTheft,
            dto.deductibleAmount,
            dto.description,
            true, // Default to true if not provided
            new Date(), // createdAt - not provided by API
            null, // updatedAt
            null, // deletedAt
            false // isDeleted
        );
    }

    /**
     * Map array of DTOs to Domain Entities
     */
    static toDomainList(dtos: InsurancePackageResponse[]): InsurancePackage[] {
        return dtos.map(dto => this.toDomain(dto));
    }

    /**
     * Map Domain Entity to DTO (for creating/updating)
     */
    static toDTO(entity: InsurancePackage): InsurancePackageResponse {
        return {
            id: entity.id,
            packageName: entity.packageName,
            packageFee: entity.packageFee,
            coveragePersonLimit: entity.coveragePersonLimit,
            coveragePropertyLimit: entity.coveragePropertyLimit,
            coverageVehiclePercentage: entity.coverageVehiclePercentage,
            coverageTheft: entity.coverageTheft,
            deductibleAmount: entity.deductibleAmount,
            description: entity.description,
        };
    }
}