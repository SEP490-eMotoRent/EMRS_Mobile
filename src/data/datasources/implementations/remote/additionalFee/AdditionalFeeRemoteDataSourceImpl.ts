import { ApiEndpoints } from "../../../../../core/network/APIEndpoint";
import { ApiResponse } from "../../../../../core/network/APIResponse";
import { AxiosClient } from "../../../../../core/network/AxiosClient";
import { AdditionalFeeRemoteDataSource } from "../../../interfaces/remote/additionalFee/AdditionalFeeRemoteDataSource";
import { AddFeeNormalRequest } from "../../../../models/additionalFee/AddFeeNormalRequest";
import {
  DamageTypesResponse,
  DamageType,
} from "../../../../models/additionalFee/DamageTypesResponse";
import { AddFeeDamageRequest } from "../../../../models/additionalFee/AddFeeDamageRequest";

export class AdditionalFeeRemoteDataSourceImpl
  implements AdditionalFeeRemoteDataSource
{
  constructor(private axiosClient: AxiosClient) {}

  async addLateReturnFee(
    request: AddFeeNormalRequest
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.additionalFees.addLateReturnFee,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding late return fee:", error);
      throw error;
    }
  }

  async addCleaningFee(
    request: AddFeeNormalRequest
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.additionalFees.addCleaningFee,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding cleaning fee:", error);
      throw error;
    }
  }

  async addCrossBranchFee(
    request: AddFeeNormalRequest
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.additionalFees.addCrossBranchFee,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding cross branch fee:", error);
      throw error;
    }
  }

  async addExcessKmFee(
    request: AddFeeNormalRequest
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.additionalFees.addExcessKmFee,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding excess km fee:", error);
      throw error;
    }
  }

  async addDamageFee(request: AddFeeDamageRequest): Promise<ApiResponse<any>> {
    try {
      const response = await this.axiosClient.post<ApiResponse<any>>(
        ApiEndpoints.additionalFees.addDamageFee,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding damage fee:", error);
      throw error;
    }
  }

  async getDamageTypes(): Promise<ApiResponse<DamageTypesResponse>> {
    try {
      const response = await this.axiosClient.get<
        ApiResponse<DamageTypesResponse>
      >(ApiEndpoints.additionalFees.getDamageTypes);
      return response.data;
    } catch (error: any) {
      console.error("Error getting damage types:", error);
      throw error;
    }
  }
}
