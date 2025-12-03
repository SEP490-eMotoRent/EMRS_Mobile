import { Configuration } from "../../entities/configuration/Configuration";
import { ConfigurationRepository } from "../../repositories/configuration/ConfigurationRepository";

export class GetAdditionalPricingConfigUseCase {
    private repository: ConfigurationRepository;

    constructor(repository: ConfigurationRepository) {
        this.repository = repository;
    }

    async execute(): Promise<Configuration[]> {
        return await this.repository.getAdditionalFricingConfig();
    }
}