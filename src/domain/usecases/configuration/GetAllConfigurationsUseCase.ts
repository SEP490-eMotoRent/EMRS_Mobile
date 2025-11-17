import { Configuration } from "../../entities/configuration/Configuration";
import { ConfigurationRepository } from "../../repositories/configuration/ConfigurationRepository";

export class GetAllConfigurationsUseCase {
    private repository: ConfigurationRepository;

    constructor(repository: ConfigurationRepository) {
        this.repository = repository;
    }

    async execute(): Promise<Configuration[]> {
        return await this.repository.getAll();
    }
}