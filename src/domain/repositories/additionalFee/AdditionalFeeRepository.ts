import { ApiResponse } from "../../../core/network/APIResponse";
import { AddFeeNormalRequest } from "../../../data/models/additionalFee/AddFeeNormalRequest";
import { AddFeeDamageRequest } from "../../../data/models/additionalFee/AddFeeDamageRequest";
import { DamageTypesResponse } from "../../../data/models/additionalFee/DamageTypesResponse";

export interface AdditionalFeeRepository {
    addLateReturnFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>>;
    addCrossBranchFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>>;
    addExcessKmFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>>;
    addDamageFee(request: AddFeeDamageRequest): Promise<ApiResponse<any>>;
    addCleaningFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>>;
    getDamageTypes(): Promise<ApiResponse<DamageTypesResponse>>;
}