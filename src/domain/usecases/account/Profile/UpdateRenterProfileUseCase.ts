import { UpdateRenterResponse } from "../../../../data/models/account/renter/update/RenterAccountUpdateResponse";
import { UpdateRenterRequest } from "../../../../data/models/account/renter/update/UpdateRenterRequest";
import { RenterRepository } from "../../../repositories/account/RenterRepository";
export class UpdateRenterProfileUseCase {
    constructor(private renterRepository: RenterRepository) {}

    /**
     * Execute profile update
     * @param request - Update request with profile data
     * @returns UpdateRenterResponse with updated profile data
     */
    async execute(request: UpdateRenterRequest): Promise<UpdateRenterResponse> {
        return await this.renterRepository.update(request);
    }
}