import { Renter } from "../../../entities/account/Renter";
import { RenterRepository } from "../../../repositories/account/RenterRepository";

export class UpdateRenterProfileUseCase {
    constructor(private renterRepository: RenterRepository) {}

    async execute(renter: Renter): Promise<void> {
        await this.renterRepository.update(renter);
    }
}