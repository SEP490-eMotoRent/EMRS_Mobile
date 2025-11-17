import { Configuration } from "../../../domain/entities/configuration/Configuration";
import { ConfigurationType } from "../../../domain/entities/configuration/ConfigurationType";
import { ConfigurationDTO } from "../../models/configuration/ConfigurationResponseDTO";

export class ConfigurationMapper {
    static toDomain(dto: ConfigurationDTO): Configuration {
        return new Configuration(
        dto.id,
        dto.title,
        dto.description,
        dto.type as ConfigurationType,
        dto.value,
        new Date(dto.createdAt),
        dto.updatedAt ? new Date(dto.updatedAt) : null,
        dto.deletedAt ? new Date(dto.deletedAt) : null,
        dto.isDeleted
        );
    }

    static toDomainList(dtos: ConfigurationDTO[]): Configuration[] {
        return dtos.map((dto) => this.toDomain(dto));
    }
}