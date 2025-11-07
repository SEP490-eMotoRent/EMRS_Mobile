import { BaseEntity, CreateEntityInput, UpdateEntityInput } from "../shared/BaseEntity";
import { Renter } from "./Renter";
import { Staff } from "./Staff";

export class Ticket implements BaseEntity {
    public readonly id: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public deletedAt: Date | null;
    public isDeleted: boolean;

    // C# Fields
    public ticketType: string;
    public title: string;
    public description: string;
    public status: string;
    public renterId: string;
    public staffId?: string;

    // Relations
    public renter: Renter;
    public staff?: Staff;

    constructor(
        id: string,
        ticketType: string,
        title: string,
        description: string,
        status: string,
        renterId: string,
        renter: Renter,
        staffId?: string,
        staff?: Staff,
        createdAt: Date = new Date(),
        updatedAt: Date | null = null,
        deletedAt: Date | null = null,
        isDeleted: boolean = false
    ) {
        this.id = id;
        this.ticketType = ticketType;
        this.title = title;
        this.description = description;
        this.status = status;
        this.renterId = renterId;
        this.renter = renter;
        this.staffId = staffId;
        this.staff = staff;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.isDeleted = isDeleted;
    }

    isAssignedToStaff(): boolean {
        return !!this.staffId;
    }

    close(): void {
        this.status = "Closed";
        this.updatedAt = new Date();
    }

    delete(): void {
        this.deletedAt = new Date();
        this.updatedAt = new Date();
        this.isDeleted = true;
    }

    restore(): void {
        this.deletedAt = null;
        this.updatedAt = new Date();
        this.isDeleted = false;
    }
}

export type CreateTicketInput = CreateEntityInput<Ticket>;
export type UpdateTicketInput = UpdateEntityInput<Ticket>;
