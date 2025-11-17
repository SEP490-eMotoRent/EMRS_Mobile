import { Configuration } from "../../entities/configuration/Configuration";
import { ConfigurationRepository } from "../../repositories/configuration/ConfigurationRepository";

export class GetConfigurationByIdUseCase {
    private repository: ConfigurationRepository;

    constructor(repository: ConfigurationRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<Configuration | null> {
        if (!id || id.trim() === "") {
        throw new Error("Configuration ID is required");
        }
        return await this.repository.getById(id);
    }
}