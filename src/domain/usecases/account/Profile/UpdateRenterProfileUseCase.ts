import { Renter } from "../../../entities/account/Renter";
import { RenterRepository } from "../../../repositories/account/RenterRepository";
export class UpdateRenterProfileUseCase {
    constructor(private renterRepository: RenterRepository) {}

    async execute(request: any): Promise<void> {  // ← CHANGE FROM Renter TO any
        await this.renterRepository.update(request);
    }
}