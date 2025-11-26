import { CreateFeedbackInput, Feedback } from "../../entities/booking/Feedback";
import { FeedbackRepository } from "../../repositories/booking/FeedbackRepository";

export class CreateFeedbackUseCase {
    private repository: FeedbackRepository;

    constructor(repository: FeedbackRepository) {
        this.repository = repository;
    }

    async execute(input: CreateFeedbackInput): Promise<Feedback> {
        if (input.rating < 0 || input.rating > 5) {
            throw new Error("Rating must be between 0 and 5");
        }
        return this.repository.createFeedback(input);
    }
}