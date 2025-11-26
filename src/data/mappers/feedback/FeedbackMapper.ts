import { Feedback } from "../../../domain/entities/booking/Feedback";
import { FeedbackResponse } from "../../models/feedback/FeedbackResponse";

export class FeedbackMapper {
    static toDomain(dto: FeedbackResponse): Feedback {
        return new Feedback(
            dto.feedbackId,
            dto.rating,
            dto.comment,
            dto.renterId,
            dto.bookingId
        );
    }

    static toDomainList(dtos: FeedbackResponse[]): Feedback[] {
        return dtos.map(dto => this.toDomain(dto));
    }
}