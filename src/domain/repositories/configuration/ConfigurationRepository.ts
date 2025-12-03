import { Configuration } from "../../entities/configuration/Configuration";
import { ConfigurationType } from "../../entities/configuration/ConfigurationType";

export interface ConfigurationRepository {
    getAll(): Promise<Configuration[]>;
    getById(id: string): Promise<Configuration | null>;
    getByType(type: ConfigurationType): Promise<Configuration[]>;
    getAdditionalFricingConfig(): Promise<Configuration[]>;
}