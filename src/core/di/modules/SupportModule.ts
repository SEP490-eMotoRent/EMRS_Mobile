import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { GpsSharingRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/gpsSharing/GpsSharingRemoteDataSourceImpl";
import { TicketRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/ticket/TicketRemoteDataSourceImpl";

// Repositories
import { GpsSharingRepositoryImpl } from "../../../data/repositories/gpsSharing/GpsSharingRepositoryImpl";
import { TicketRepositoryImpl } from "../../../data/repositories/ticket/TicketRepositoryImpl";
import { TicketRepository } from "../../../domain/repositories/ticket/TicketRepository";

// Use Cases
import { GpsSharingInviteUseCase } from "../../../domain/usecases/gpsSharing/GpsSharingInviteUseCase";
import { CreateTicketUseCase } from "../../../domain/usecases/ticket/CreateTicketUseCase";
import { GetTicketDetailUseCase } from "../../../domain/usecases/ticket/GetTicketDetailUseCase";
import { GetTicketsByBookingIdUseCase } from "../../../domain/usecases/ticket/GetTicketsByBookingIdUseCase";

/**
 * SupportModule - All support and assistance-related functionality
 * 
 * Includes:
 * - Support tickets
 * - GPS sharing for assistance
 */
export class SupportModule {
    // Data Sources
    public readonly ticketRemoteDataSource: TicketRemoteDataSourceImpl;
    public readonly gpsSharingRemoteDataSource: GpsSharingRemoteDataSourceImpl;

    // Repositories
    public readonly ticketRepository: TicketRepository;
    public readonly gpsSharingRepository: GpsSharingRepositoryImpl;

    // Use Cases - Organized by feature
    public readonly tickets = {
        create: {} as CreateTicketUseCase,
        getByBooking: {} as GetTicketsByBookingIdUseCase,
        getDetail: {} as GetTicketDetailUseCase,
    };

    public readonly gpsSharing = {
        invite: {} as GpsSharingInviteUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.ticketRemoteDataSource = new TicketRemoteDataSourceImpl(axiosClient);
        this.gpsSharingRemoteDataSource = new GpsSharingRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.ticketRepository = new TicketRepositoryImpl(this.ticketRemoteDataSource);
        this.gpsSharingRepository = new GpsSharingRepositoryImpl(this.gpsSharingRemoteDataSource);

        // Initialize ticket use cases
        this.tickets.create = new CreateTicketUseCase(this.ticketRepository);
        this.tickets.getByBooking = new GetTicketsByBookingIdUseCase(this.ticketRepository);
        this.tickets.getDetail = new GetTicketDetailUseCase(this.ticketRepository);

        // Initialize GPS sharing use cases
        this.gpsSharing.invite = new GpsSharingInviteUseCase(this.gpsSharingRepository);
    }

    static create(axiosClient: AxiosClient): SupportModule {
        return new SupportModule(axiosClient);
    }
}