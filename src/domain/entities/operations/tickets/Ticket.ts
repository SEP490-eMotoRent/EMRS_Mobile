import { Staff } from "../../account/Staff";
import { Booking } from "../../booking/Booking";
import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../../shared/BaseEntity";
import { Media } from "../../shared/Media";

export class Ticket implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    public ticketType: string;
    public title: string;
    public description: string;
    public status: string;
    public bookingId: string;
    public staffId: string | null;

    // ✅ RELATIONS
    public booking: Booking;
    public staff: Staff | null;
    public attachments: Media[];

    constructor(
        id: string,
        ticketType: string,
        title: string,
        description: string,
        status: string,
        bookingId: string,
        booking: Booking,
        staffId: string | null = null,
        staff: Staff | null = null,
        attachments: Media[] = [],
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;

        this.ticketType = ticketType;
        this.title = title;
        this.description = description;
        this.status = status;
        this.bookingId = bookingId;
        this.staffId = staffId;

        // ✅ RELATIONS
        this.booking = booking;
        this.staff = staff;
        this.attachments = attachments;
    }

    delete(): void {
        this.updatedAt = new Date();
        this.deletedAt = new Date();
        this.isDeleted = true;
    }

    restore(): void {
        this.updatedAt = new Date();
        this.deletedAt = null;
        this.isDeleted = false;
    }
}

export type CreateTicketInput = CreateEntityInput<Ticket>;
export type UpdateTicketInput = UpdateEntityInput<Ticket>;