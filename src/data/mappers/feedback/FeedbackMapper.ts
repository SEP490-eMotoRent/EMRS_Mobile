import { Feedback } from "../../../domain/entities/booking/Feedback";
import { FeedbackDetailResponse } from "../../models/feedback/FeedbackDetailResponse";
import { FeedbackResponse } from "../../models/feedback/FeedbackResponse";


export class FeedbackMapper {
    /**
     * Map FeedbackDetailDTO (from GET endpoints) to domain entity
     * Has renterName, no renterId
     */
    static fromDetailDTO(dto: FeedbackDetailResponse): Feedback {
        return new Feedback(
            dto.feedbackId,
            dto.rating,
            dto.comment,
            dto.bookingId,
            dto.renterName,  // renterName from detail response
            undefined        // no renterId
        );
    }

    /**
     * Map FeedbackResponseDTO (from POST /create) to domain entity
     * Has renterId, no renterName
     */
    static fromResponseDTO(dto: FeedbackResponse): Feedback {
        return new Feedback(
            dto.feedbackId,
            dto.rating,
            dto.comment,
            dto.bookingId,
            dto.renterId     // renterId from create response
        );
    }

    static fromDetailDTOList(dtos: FeedbackDetailResponse[]): Feedback[] {
        return dtos.map(dto => this.fromDetailDTO(dto));
    }

    static fromResponseDTOList(dtos: FeedbackResponse[]): Feedback[] {
        return dtos.map(dto => this.fromResponseDTO(dto));
    }
}