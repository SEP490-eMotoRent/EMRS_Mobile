import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AddFeeNormalRequest } from "../../../../models/additionalFee/AddFeeNormalRequest";
import { AddFeeDamageRequest } from "../../../../models/additionalFee/AddFeeDamageRequest";
import { DamageTypesResponse } from "../../../../models/additionalFee/DamageTypesResponse";


export interface AdditionalFeeRemoteDataSource {
    addLateReturnFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>>;
    addCrossBranchFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>>;
    addExcessKmFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>>;
    addDamageFee(request: AddFeeDamageRequest): Promise<ApiResponse<any>>;
        addCleaningFee(request: AddFeeNormalRequest): Promise<ApiResponse<any>>;
    getDamageTypes(): Promise<ApiResponse<DamageTypesResponse>>;
}

