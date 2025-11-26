import { Feedback } from "../../entities/booking/Feedback";
import { FeedbackRepository } from "../../repositories/booking/FeedbackRepository";

export class GetAllFeedbacksUseCase {
    private repository: FeedbackRepository;

    constructor(repository: FeedbackRepository) {
        this.repository = repository;
    }

    async execute(): Promise<Feedback[]> {
        return this.repository.getAllFeedbacks();
    }
}