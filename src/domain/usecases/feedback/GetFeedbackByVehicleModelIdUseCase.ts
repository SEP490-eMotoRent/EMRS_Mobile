import { Feedback } from "../../entities/booking/Feedback";
import { FeedbackRepository } from "../../repositories/booking/FeedbackRepository";

export class GetFeedbackByVehicleModelIdUseCase {
    private repository: FeedbackRepository;

    constructor(repository: FeedbackRepository) {
        this.repository = repository;
    }

    async execute(vehicleModelId: string): Promise<Feedback[]> {
        return this.repository.getFeedbackByVehicleModelId(vehicleModelId);
    }
}