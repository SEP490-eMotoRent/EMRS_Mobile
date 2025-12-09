import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { GpsSharingRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/gpsSharing/GpsSharingRemoteDataSourceImpl';
import { TicketRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/ticket/TicketRemoteDataSourceImpl';

// Repositories
import { GpsSharingRepositoryImpl } from '../../../data/repositories/gpsSharing/GpsSharingRepositoryImpl';
import { TicketRepositoryImpl } from '../../../data/repositories/ticket/TicketRepositoryImpl';

// Use Cases - Tickets
import { CreateTicketUseCase } from '../../../domain/usecases/ticket/CreateTicketUseCase';
import { GetTicketDetailUseCase } from '../../../domain/usecases/ticket/GetTicketDetailUseCase';
import { GetTicketsByBookingIdUseCase } from '../../../domain/usecases/ticket/GetTicketsByBookingIdUseCase';

// Use Cases - GPS Sharing
import { GpsSharingInviteUseCase } from '../../../domain/usecases/gpsSharing/GpsSharingInviteUseCase';

/**
 * SupportModule - Complete Support Domain
 * 
 * Handles all support-related functionality:
 * - Ticket creation and management
 * - GPS location sharing
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class SupportModule {
    // ==================== REPOSITORIES ====================
    private _ticketRepository: TicketRepositoryImpl | null = null;
    private _gpsSharingRepository: GpsSharingRepositoryImpl | null = null;

    // ==================== USE CASES - TICKETS ====================
    private _createTicketUseCase: CreateTicketUseCase | null = null;
    private _getTicketsByBookingIdUseCase: GetTicketsByBookingIdUseCase | null = null;
    private _getTicketDetailUseCase: GetTicketDetailUseCase | null = null;

    // ==================== USE CASES - GPS SHARING ====================
    private _gpsSharingInviteUseCase: GpsSharingInviteUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): SupportModule {
        return new SupportModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get ticketRepository(): TicketRepositoryImpl {
        if (!this._ticketRepository) {
        const remoteDataSource = new TicketRemoteDataSourceImpl(this.axiosClient);
        this._ticketRepository = new TicketRepositoryImpl(remoteDataSource);
        }
        return this._ticketRepository;
    }

    get gpsSharingRepository(): GpsSharingRepositoryImpl {
        if (!this._gpsSharingRepository) {
        const remoteDataSource = new GpsSharingRemoteDataSourceImpl(this.axiosClient);
        this._gpsSharingRepository = new GpsSharingRepositoryImpl(remoteDataSource);
        }
        return this._gpsSharingRepository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Ticket use cases
     * Usage: container.support.tickets.create.execute()
     */
    get tickets() {
        return {
        create: this.createTicketUseCase,
        getByBookingId: this.getTicketsByBookingIdUseCase,
        getDetail: this.getTicketDetailUseCase,
        };
    }

    /**
     * GPS sharing use cases
     * Usage: container.support.gpsSharing.invite.execute()
     */
    get gpsSharing() {
        return {
        invite: this.gpsSharingInviteUseCase,
        };
    }

    // ==================== PRIVATE GETTERS - TICKETS ====================

    private get createTicketUseCase(): CreateTicketUseCase {
        if (!this._createTicketUseCase) {
        this._createTicketUseCase = new CreateTicketUseCase(this.ticketRepository);
        }
        return this._createTicketUseCase;
    }

    private get getTicketsByBookingIdUseCase(): GetTicketsByBookingIdUseCase {
        if (!this._getTicketsByBookingIdUseCase) {
        this._getTicketsByBookingIdUseCase = new GetTicketsByBookingIdUseCase(this.ticketRepository);
        }
        return this._getTicketsByBookingIdUseCase;
    }

    private get getTicketDetailUseCase(): GetTicketDetailUseCase {
        if (!this._getTicketDetailUseCase) {
        this._getTicketDetailUseCase = new GetTicketDetailUseCase(this.ticketRepository);
        }
        return this._getTicketDetailUseCase;
    }

    // ==================== PRIVATE GETTERS - GPS SHARING ====================

    private get gpsSharingInviteUseCase(): GpsSharingInviteUseCase {
        if (!this._gpsSharingInviteUseCase) {
        this._gpsSharingInviteUseCase = new GpsSharingInviteUseCase(this.gpsSharingRepository);
        }
        return this._gpsSharingInviteUseCase;
    }
}