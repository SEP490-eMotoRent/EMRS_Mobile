import { CreateRentalPricingRequest } from "../../../../models/financial/rentalPricing/CreateRentalPricingRequest";
import { RentalPricingResponse } from "../../../../models/financial/rentalPricing/RentalPricingResponse";

export interface RentalPricingLocalDataSource {
    create(request: CreateRentalPricingRequest): Promise<RentalPricingResponse>;
    getAll(): Promise<RentalPricingResponse[]>;
    getById(id: string): Promise<RentalPricingResponse | null>;
    update(id: string, pricing: RentalPricingResponse): Promise<void>;
    delete(id: string): Promise<void>;
}