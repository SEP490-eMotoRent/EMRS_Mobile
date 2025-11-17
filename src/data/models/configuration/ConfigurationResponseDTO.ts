import { ApiResponse } from "../../../core/network/APIResponse";

export interface ConfigurationDTO {
    id: string;
    title: string;
    description: string;
    type: number;
    value: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    isDeleted: boolean;
}

export type ConfigurationResponse = ApiResponse<ConfigurationDTO>;
export type ConfigurationListResponse = ApiResponse<ConfigurationDTO[]>;