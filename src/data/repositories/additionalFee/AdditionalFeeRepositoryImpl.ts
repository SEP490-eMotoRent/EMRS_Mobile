import { ApiResponse } from "../../../core/network/APIResponse";
import { AdditionalFeeRemoteDataSource } from "../../datasources/interfaces/remote/additionalFee/AdditionalFeeRemoteDataSource";
import { AdditionalFeeRepository } from "../../../domain/repositories/additionalFee/AdditionalFeeRepository";
import { AddFeeNormalRequest } from "../../models/additionalFee/AddFeeNormalRequest";
import { AddFeeDamageRequest } from "../../models/additionalFee/AddFeeDamageRequest";
import { DamageTypesResponse } from "../../models/additionalFee/DamageTypesResponse";

export class AdditionalFeeRepositoryImpl implements AdditionalFeeRepository {
        constructor(private remoteDataSource: AdditionalFeeRemoteDataSource) {}

    async addLateReturnFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>> {
        return await this.remoteDataSource.addLateReturnFee(request);
    }

    async addCrossBranchFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>> {
        return await this.remoteDataSource.addCrossBranchFee(request);
    }

    async addExcessKmFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>> {
        return await this.remoteDataSource.addExcessKmFee(request);
    }

    async addDamageFee(request: AddFeeDamageRequest): Promise<ApiResponse<any>> {
        return await this.remoteDataSource.addDamageFee(request);
    }
    
    async addCleaningFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>> {
        return await this.remoteDataSource.addCleaningFee(request);
    }

    async getDamageTypes(): Promise<ApiResponse<DamageTypesResponse>> {
        return await this.remoteDataSource.getDamageTypes();
    }
}