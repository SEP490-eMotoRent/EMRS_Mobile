import { Configuration } from "../../entities/configuration/Configuration";
import { ConfigurationType } from "../../entities/configuration/ConfigurationType";
import { ConfigurationRepository } from "../../repositories/configuration/ConfigurationRepository";

export class GetConfigurationsByTypeUseCase {
    private repository: ConfigurationRepository;

    constructor(repository: ConfigurationRepository) {
        this.repository = repository;
    }

    async execute(type: ConfigurationType): Promise<Configuration[]> {
        return await this.repository.getByType(type);
    }
}